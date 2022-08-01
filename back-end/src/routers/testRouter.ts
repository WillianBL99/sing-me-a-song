import { Router } from 'express';
import {
	deleteAllRecommendations,
	insertRecommendation,
} from '../controllers/recommendationTestController.js';

const testRouter = Router();

testRouter.post('/insert', insertRecommendation);
testRouter.delete('/delete-all', deleteAllRecommendations);

export default testRouter;
