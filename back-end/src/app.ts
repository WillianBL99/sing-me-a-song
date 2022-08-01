import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import recommendationRouter from './routers/recommendationRouter.js';
import testRouter from './routers/testRouter.js';

const app = express();
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'test') {
	app.use('/test', testRouter);
}
app.use('/recommendations', recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
