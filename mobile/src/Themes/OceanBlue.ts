import { DefaultTheme } from 'styled-components/native';
import strings from '~/Locales';

const OceanBlue: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_OceanBlue,
    key: 'oceanblue',
    isPro: true,

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

        productExpiredBackground: '#CC4B4B',
        productNextToExpBackground: '#DDE053',
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',
    },
};

export default OceanBlue;
