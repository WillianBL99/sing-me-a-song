import { Request, Response } from 'express';
import recommendationTestService from '../services/recommendationTesteService.js';

export async function deleteAllRecommendations(_req: Request, res: Response) {
	await recommendationTestService.deleteAll();
	res.sendStatus(200);
}

export async function insertRecommendation(req: Request, res: Response) {
	const { body } = req;
	await recommendationTestService.insert(body);
	res.sendStatus(200);
}
