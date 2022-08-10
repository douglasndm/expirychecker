import { darken } from 'polished';
import { DefaultTheme } from 'styled-components/native';

import strings from '~/Locales';

const UltraViolet: DefaultTheme = {
    name: strings.View_Settings_Appearance_Theme_UltraViolet,
    key: 'ultraviolet',
    isPro: true,
    isDark: true,

    colors: {
        primary: darken(0.1, '#7b00ba'),
        accent: darken(0.1, '#7b00ba'),
        background: '#000000',
        text: '#fff',
        subText: '#EAEAEA',
        textAccent: '#7b00ba',

        inputText: '#ffffff',
        placeholderColor: '#EAEAEA',
        inputBackground: '#373737',

        productBackground: '#373737',
        productCardText: '#fff',

        productExpiredBackground: darken(0.1, '#e01010'),
        productNextToExpBackground: darken(0.1, '#eded1f'),
        productThreatedBackground: '#b0b0b0',
        productNextOrExpiredText: '#FFF',

        TabBackground: 'rgba(0, 0, 0, 0.95)',
        TabText: '#ffffff',
        TabTextSelected: '#8e02d6',
    },
};

export default UltraViolet;
