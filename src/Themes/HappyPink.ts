import { DefaultTheme } from 'styled-components/native';

import strings from '~/Locales';

const HappyPink: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_HappyPink,
    key: 'happypink',
    isPro: true,

    colors: {
        primary: '#f772b7',
        accent: '#f772b7',
        background: '#f6f6f6',
        text: '#000',
        subText: '#999999',
        textAccent: '#f772b7',

        inputText: '#050505',
        placeholderColor: '#999999',
        inputBackground: '#FFF',

        productBackground: '#FFF',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',
    },
};

export default HappyPink;
