import { DefaultTheme } from 'styled-components/native';
import { darken } from 'polished';

const DarkGreen: DefaultTheme = {
    dark: true,
    mode: 'exact',

    colors: {
        primary: darken(0.1, '#33e860'),
        accent: darken(0.1, '#33e860'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#33e860',

        inputText: '#ffffff',
        inputBackground: '#565657',

        productBackground: '#565657',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productNextOrExpiredText: '#FFF',
    },
};

export default DarkGreen;
