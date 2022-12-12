const path = require('path');

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
          "@shared": "../shared/src",
          /*react: require.resolve('react', {
            paths: [path.join(__dirname, './')],
          }),
          '^react-native$': require.resolve(`react-native`, {
            paths: [path.join(__dirname, './')],
          }),
          '^react-native/(.+)': ([, name]) =>
            require.resolve(`react-native/${name}`, {
              paths: [path.join(__dirname, './')],
            }),
          '^styled-components$': require.resolve(`styled-components`, {
            paths: [path.join(__dirname, './')],
          }),*/
        },
      },
    ],
    'jest-hoist',
    'react-native-reanimated/plugin',
  ],
};
