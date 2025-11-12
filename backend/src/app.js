import express from 'express';
import bodyParser from 'body-parser';
import pool from './db.js';
import taskRoutes from './routes/tasks.js';
import cors from "cors"
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

pool.query(`
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
  )
`);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
