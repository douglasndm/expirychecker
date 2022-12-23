module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	env: {
		production: {
			plugins: ['react-native-paper/babel'],
		},
	},
	plugins: [
		[
			require.resolve('babel-plugin-module-resolver'),
			{
				cwd: 'babelrc',
				extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
				alias: {
					'~': './src',
					'@components': '../shared/src/Components',
					'@views': '../shared/src/Views',
					'@themes': '../shared/src/Themes',
					'@styles': '../shared/src/Styles',
					'@utils': '../shared/src/Utils',
					'@shared': '../shared/src',
				},
			},
		],
		'jest-hoist',
		'react-native-reanimated/plugin',
	],
};
