import { getLocales } from 'react-native-localize';

function getCurrentLocale(): string {
    switch (getLocales()[0].languageCode) {
        case 'en':
            return 'en-US';
        default:
            return 'pt-BR';
    }
}

export { getCurrentLocale };
