import express from 'express';
import bodyParser from 'body-parser';
import pool from './db.js';
import taskRoutes from './routes/tasks.js';
import cors from "cors"
const app = express();
const client = require('prom-client');
const register = new client.Registry();

app.use(cors())
app.use(bodyParser.json());
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;


    // Create a default registry for metrics
 
    // Enable the collection of default metrics
    client.collectDefaultMetrics({ register });

    // Create a custom counter
    const httpRequestCounter = new client.Counter({
        name: 'http_requests_total',
        help: 'Total number of HTTP requests',
        labelNames: ['method', 'route', 'code'],
        registers: [register],
    });

    // Increment the counter on each request
    app.use((req, res, next) => {
        res.on('finish', () => {
            httpRequestCounter.inc({
                method: req.method,
                route: req.path,
                code: res.statusCode,
            });
        });
        next();
    });

    // Expose metrics endpoint
    app.get('/metrics', async (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    });

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
  )
`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
