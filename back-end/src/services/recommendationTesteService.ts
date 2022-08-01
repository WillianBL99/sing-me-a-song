import recommendationTestRepository, {
	RecommendatinTestData,
} from '../repositories/recommendationTestRepository.js';

async function deleteAll() {
	await recommendationTestRepository.deleteAll();
}

async function insert(data: RecommendatinTestData) {
	await recommendationTestRepository.insert(data);
}

const recommendationTestService = {
	insert,
	deleteAll,
};

export default recommendationTestService;
