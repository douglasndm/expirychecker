import 'styled-components';

declare module "styled-components" {
    export interface DefaultTheme {
        dark: boolean,
        mode?: string;

        fonts?: {
            regular?: number;
            medium?: number;
            light?: number;
            thin?: number;
        }

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
        },
    }
  }
