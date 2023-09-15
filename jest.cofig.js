const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
	...tsjPreset,
	preset: 'react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transform: {
		'^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
		'\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
	},
	testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
	testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
	cacheDirectory: '.jest/cache',
};
