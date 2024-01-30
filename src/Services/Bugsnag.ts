import Bugsnag from '@bugsnag/react-native';
import BugsnagPluginReactNavigation from '@bugsnag/plugin-react-navigation';

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
