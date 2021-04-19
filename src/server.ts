import express, { Request, Response } from 'express';
import logger from 'morgan';
import baseRouter from './api/check';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add routes
app.use('/api', baseRouter);

app.get('*', (req: Request, res: Response) => {
  // send a 404
  res.status(400).send();
});

// Export express instance
export default app;
