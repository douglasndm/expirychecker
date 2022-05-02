import { LinkingOptions } from '@react-navigation/native';

const linking: LinkingOptions = {
    prefixes: ['expirychecker://'],
    config: {
        screens: {
            HomePage: {
                screens: {
                    Pro: 'plans',
                    About: 'about',
                },
            },
        },
    },
};

export default linking;
