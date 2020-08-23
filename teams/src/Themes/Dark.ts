import { DefaultTheme } from 'styled-components/native';
import { darken } from 'polished';

const Dark: DefaultTheme = {
    dark: true, // whether this is a dark theme or light theme.
    mode: 'exact',

    colors: {
        primary: darken(0.1, '#14d48f'),
        accent: darken(0.1, '#14d48f'),
        background: 'rgba(0, 0, 0, 0.85)',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#14d48f',

        inputText: '#ffffff',
        inputBackground: '#565657',

        productBackground: '#565657',

        productExpiredBackground: darken(0.1, '#CC4B4B'),
        productNextToExpBackground: darken(0.1, '#DDE053'),
        productNextOrExpiredText: '#FFF',
    },
};

export default Dark;
