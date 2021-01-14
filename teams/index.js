/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import './src/Services/BackgroundJobs';
import './src/Functions/OpenAppTimes';

AppRegistry.registerComponent(appName, () => App);
