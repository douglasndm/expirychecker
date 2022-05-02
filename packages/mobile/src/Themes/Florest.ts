import { DefaultTheme } from 'styled-components';
import strings from '~/Locales';

const Florest: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_Florest,
    key: 'florest',
    isPro: true,

    colors: {
        primary: '#B2EDC5',
        accent: '#B2EDC5',
        background: '#f6f6f6',
        text: '#7C7287',
        subText: '#9DC0BC',
        textAccent: '#B2EDC5',

        inputText: '#050505',
        placeholderColor: '#9DC0BC',
        inputBackground: '#FFF',

        productBackground: '#FFF',
        productCardText: '#7c7287',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',
    },
};

export default Florest;
