import { DefaultTheme } from 'styled-components';
import strings from '~/Locales';

const Florest: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_Florest,
    key: 'florest',
    isPro: true,
    isDark: false,

    colors: {
        primary: '#85c99b',
        accent: '#85c99b',
        background: '#f6f6f6',
        text: '#7C7287',
        subText: '#9DC0BC',
        textAccent: '#85c99b',

        inputText: '#050505',
        placeholderColor: '#9DC0BC',
        inputBackground: '#FFF',

        productBackground: '#FFF',
        productCardText: '#7c7287',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(255, 255, 255, 0.85)',
        TabText: '#7C7287',
        TabTextSelected: '#85c99b',
    },
};

export default Florest;
