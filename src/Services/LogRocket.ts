import LogRocket from '@logrocket/react-native';
import Config from 'react-native-config';

const enable = false;

if (!__DEV__ && enable) {
	LogRocket.init(Config.LOGROCKET_APP_ID || '');
}
