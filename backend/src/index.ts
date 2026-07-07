import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import apiRoutes from './routes/api.js';

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('AC Service CRM API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
