import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primary: string;
            accent: string;
            background: string;
            text: string;
            subText: string;
            textAccent: string;

            inputText: string;
            inputBackground: string;

            productBackground: string;

            productExpiredBackground: string;
            productNextToExpBackground: string;
            productNextOrExpiredText: string;
        };
    }
}

interface ITheme {
    dark: boolean;
    mode: 'exact' | 'adaptive';

    colors: {
        primary: string;
        accent: string;
        background: string;
        text: string;
        subText: string;
        textAccent: string;

        inputText: string;
        inputBackground: string;

        productBackground: string;

        productExpiredBackground: string;
        productNextToExpBackground: string;
        productNextOrExpiredText: string;
    };
}
