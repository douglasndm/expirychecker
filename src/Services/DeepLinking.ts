import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RoutesParams> = {
	prefixes: ['expirychecker://'],
	config: {
		screens: {
			About: 'about',
		},
	},
};

export default linking;
