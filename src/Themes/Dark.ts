import { darken } from 'polished';
import { DefaultTheme } from 'styled-components/native';

import strings from '~/Locales';

const Dark: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_Dark,
    key: 'dark',
    isPro: false,
    isDark: true,

    colors: {
        primary: darken(0.1, '#14d48f'),
        accent: darken(0.1, '#14d48f'),
        background: 'rgba(0, 0, 0, 0.85)',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#14d48f',

        inputText: '#ffffff',
        placeholderColor: '#EAEAEA',
        inputBackground: '#565657',

        productBackground: '#565657',
        productCardText: '#fff',

        productExpiredBackground: darken(0.1, '#CC4B4B'),
        productNextToExpBackground: darken(0.1, '#DDE053'),
        productThreatedBackground: darken(0.1, '#b0b0b0'),
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(0, 0, 0, 0.85)',
        TabText: '#ffffff',
        TabTextSelected: darken(0.1, '#14d48f'),
    },
};

export default Dark;
