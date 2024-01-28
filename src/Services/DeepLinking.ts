import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions<RoutesParams> = {
	prefixes: ['expirychecker://'],
	config: {
		screens: {
			Home: {
				screens: {
					Pro: 'plans',
					About: 'about',
				},
			},
		},
	},
};

export default linking;
