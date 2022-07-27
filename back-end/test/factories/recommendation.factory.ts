import { faker } from '@faker-js/faker';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
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

const youtubeLinkData = {
	1: {
		name: 'Marcelo Markes: Sinto Fluir',
		link: 'https://www.youtube.com/watch?v=bwUJsH6bVEI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=7',
	},
	2: {
		name: 'Isaias Saad: Enche-me',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=8',
	},
	3: {
		name: 'Morada: Desenvolvendo amor',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=9',
	},
	4: {
		name: 'Rodolfo Abrantes: Isaias 9',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=10',
	},
	5: {
		name: 'Thalles Roberto: Arde outra vez',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=11',
	},
};

function createRecommendationData() {
	const randomIndex = Math.floor(
		Math.random() * Object.keys(youtubeMusicLinks).length
	);
	const linkData = youtubeLinkData[randomIndex];
	return {
		name: linkData.name,
		youtubeLink: linkData.link,
	};
}

function deleteAllRecommendations() {
	return prisma.$transaction([prisma.$executeRaw`DELETE FROM recommendations`]);
}

function countRecommendations() {
	return prisma.recommendation.count();
}

function createRecommendation() {
	return prisma.recommendation.create({
		data: createRecommendationData(),
	});
}

function getRecommendationById(id: number) {
	return prisma.recommendation.findUnique({ where: { id } });
}

const recommendationFactory = {
	createRecommendationData,
	deleteAllRecommendations,
	countRecommendations,
	createRecommendation,
	getRecommendationById,
};

export default recommendationFactory;
