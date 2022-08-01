const youtubeMusicLinks = {
	1: {
		name: 'Marcelo Markes: Sinto Fluir',
		link: 'https://www.youtube.com/watch?v=bwUJsH6bVEI',
	},
	2: {
		name: 'Isaias Saad: Enche-me',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI',
	},
	3: {
		name: 'Morada: Desenvolvendo amor',
		link: 'https://www.youtube.com/watch?v=lz4x1gFBIJA',
	},
	4: {
		name: 'Rodolfo Abrantes: Isaias 9',
		link: 'https://www.youtube.com/watch?v=XPxUfGfWtRA',
	},
	5: {
		name: 'Thalles Roberto: Arde outra vez',
		link: 'https://www.youtube.com/watch?v=ozBlvwVizXI&list=PLOkdQAOeWB9aX9oRsRyBHw5D-IvDYY7YJ&index=11',
	},
};

function getRecommendation(id) {
	return youtubeMusicLinks[id];
}

const RecommendationFactory = {
	getRecommendation,
};

export default RecommendationFactory;
