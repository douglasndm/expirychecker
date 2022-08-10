import { DefaultTheme } from 'styled-components/native';
import strings from '~/Locales';

const OceanBlue: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_OceanBlue,
    key: 'oceanblue',
    isPro: true,
    isDark: false,

    colors: {
        primary: '#69dafa',
        accent: '#69dafa',
        background: '#f6f6f6',
        text: '#000',
        subText: '#999999',
        textAccent: '#69dafa',

        inputText: '#050505',
        placeholderColor: '#999999',
        inputBackground: '#FFF',

        productBackground: '#FFF',
        productCardText: '#000000',

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(255, 255, 255, 0.85)',
        TabText: '#999999',
        TabTextSelected: '#69dafa',
    },
};

export default OceanBlue;
