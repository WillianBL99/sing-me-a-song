import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const youtubeMusicLinks = {
	1: [
		'Marcelo Markes: Sinto Fluir',
		'https://www.youtube.com/watch?v=bwUJsH6bVEI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=7',
	],
	2: [
		'Isaias Saad: Enche-me',
		'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=8',
	],
	3: [
		'Morada: Desenvolvendo amor',
		'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=9',
	],
	4: [
		'Rodolfo Abrantes: Isaias 9',
		'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=10',
	],
	5: [
		'Thalles Roberto: Arde outra vez',
		'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=11',
	],
};

function createRecommendationData() {
	const numberMusic =
		Math.floor(Math.random() * Object.keys(youtubeMusicLinks).length) + 1;
	const randomMusicLink = youtubeMusicLinks[numberMusic];
	return {
		name: faker.name.findName(),
		youtubeLink: randomMusicLink,
	};
}

function deleteAllRecommendations() {
	return prisma.$transaction([prisma.$executeRaw`DELETE FROM recommendation`]);
}

function countRecommendations() {
	return prisma.$queryRaw`SELECT COUNT(*) FROM recommendation`;
}

const recommendationFactory = {
	createRecommendationData,
	deleteAllRecommendations,
	countRecommendations,
};

export default recommendationFactory;
