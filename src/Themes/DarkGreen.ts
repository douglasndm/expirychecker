import { darken } from 'polished';
import { DefaultTheme } from 'styled-components/native';
import strings from '~/Locales';

const DarkGreen: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_DarkGreen,
    key: 'darkgreen',
    isPro: true,

    colors: {
        primary: darken(0.1, '#33e860'),
        accent: darken(0.1, '#33e860'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#33e860',

        inputText: '#ffffff',
        placeholderColor: '#EAEAEA',
        inputBackground: '#373737',

        productBackground: '#373737',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productThreatedBackground: darken(0.1, '#b0b0b0'),
        productNextOrExpiredText: '#FFF',
    },
};

export default DarkGreen;
