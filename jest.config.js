/** @type {import('jest').Config} */
const config = {
	moduleFileExtensions: ['js', 'json', 'vue'],
	transformIgnorePatterns: ['/node_modules/'],
	moduleNameMapper: {
		'laravel-nova': '<rootDir>/__mocks__/laravel-nova.js',
	},
	setupFiles: ['<rootDir>/setup-file.js'],
	transform: {
		'^.+\\.js$': 'babel-jest',
		'^.+\\.vue$': '@vue/vue3-jest',
	},
	testEnvironment: '@happy-dom/jest-environment',
};

module.exports = config;
