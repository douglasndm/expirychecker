import { DefaultTheme } from 'react-native-paper';

export default {
    ...DefaultTheme,

    dark: false, // whether this is a dark theme or light theme.
    mode: 'exact',
    roundness: 12,

    colors: {
        primary: '#69dafa',
        accent: '#69dafa',
        background: '#f6f6f6',
        text: '#000',
        subText: '#999999',
        textAccent: '#69dafa',

        inputText: '#050505',
        inputBackground: '#FFF',

        productBackground: '#FFF',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productNextOrExpiredText: '#FFF',
    },
};
