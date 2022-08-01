import { Recommendation } from '@prisma/client';
import { prisma } from '../database.js';
console.log('oi');

export type RecommendatinTestData = Omit<Recommendation, 'id'>;

function deleteAll() {
	return prisma.recommendation.deleteMany();
}

function insert(data: RecommendatinTestData) {
	return prisma.recommendation.create({ data: { ...data } });
}

const recommendationTestRepository = {
	deleteAll,
	insert,
};

export default recommendationTestRepository;
