import { DefaultTheme } from 'react-native-paper';
import { darken } from 'polished';

export default {
    ...DefaultTheme,

    dark: true, // whether this is a dark theme or light theme.
    mode: 'exact',
    roundness: 12,

    colors: {
        primary: darken(0.1, '#7b00ba'),
        accent: darken(0.1, '#7b00ba'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#7b00ba',

        inputText: '#ffffff',
        inputBackground: '#565657',

        productBackground: '#565657',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productNextOrExpiredText: '#FFF',
    },
};
