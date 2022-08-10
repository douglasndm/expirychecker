import { DefaultTheme } from 'styled-components';

import strings from '~/Locales';

const JustBlue: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_JustBlue,
    key: 'justblue',
    isPro: true,
    isDark: true,

    colors: {
        primary: '#918EF4',
        accent: '#918EF4',
        background: '#141B41',
        text: '#ffffff',
        subText: '#ffffff',
        textAccent: '#918EF4',

        inputText: '#000000',
        placeholderColor: '#5e5e5e',
        inputBackground: '#ffffff',

        productBackground: '#ffffff',
        productCardText: '#000000',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(20, 27, 65, 0.85)',
        TabText: '#fff',
        TabTextSelected: '#918EF4',
    },
};

export default JustBlue;
