import { DefaultTheme } from 'styled-components/native';

import strings from '~/Locales';

const Relax: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_Relax,
    key: 'relax',
    isPro: true,
    isDark: false,

    colors: {
        primary: '#99e1d9',
        accent: '#99e1d9',
        background: '#f0f7f4',
        text: '#32292f',
        subText: '#705d56',
        textAccent: '#99e1d9',

        inputText: '#32292f',
        placeholderColor: '#705d56',
        inputBackground: '#FFF',

        productBackground: '#FFF',
        productCardText: '#32292f',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(255, 255, 255, 0.85)',
        TabText: '#32292f',
        TabTextSelected: '#99e1d9',
    },
};

export default Relax;
