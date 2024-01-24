import Bugsnag from '@bugsnag/react-native';
import BugsnagPluginReactNavigation from '@bugsnag/plugin-react-navigation';

import packageInfo from '@expirychecker/../package.json';

Bugsnag.start({
	plugins: [new BugsnagPluginReactNavigation()],
	onError: () => {
		if (__DEV__) {
			return false;
		}

		return true;
	},
});

export { Bugsnag };
