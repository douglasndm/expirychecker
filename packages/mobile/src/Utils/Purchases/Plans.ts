import { Platform } from 'react-native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import strings from '~/Locales';

function getPlansString(pack: PurchasesPackage): string {
    const { price_string, introPrice } = pack.product;

    let text = '';

    if (pack.packageType === PACKAGE_TYPE.MONTHLY) {
        if (Platform.OS === 'android') {
            if (introPrice) {
                text = strings.View_Subscription_Monthly_WithIntroText.replace(
                    '{INTRO_PRICE}',
                    introPrice.priceString
                ).replace('{PRICE}', price_string);
                return text;
            }
        }
        text = strings.View_Subscription_Monthly_Text.replace(
            '{PRICE}',
            price_string
        );
    } else if (pack.packageType === PACKAGE_TYPE.THREE_MONTH) {
        if (Platform.OS === 'android') {
            if (introPrice) {
                text = strings.View_Subscription_3Months_WithIntroText.replace(
                    '{INTRO_PRICE}',
                    introPrice.priceString
                ).replace('{PRICE}', price_string);
            }
        }

        text = strings.View_Subscription_3Months_Text.replace(
            '{PRICE}',
            price_string
        );
    } else if (pack.packageType === PACKAGE_TYPE.ANNUAL) {
        if (Platform.OS === 'android') {
            if (introPrice) {
                text = strings.View_Subscription_AYear_WithIntroText.replace(
                    '{INTRO_PRICE}',
                    introPrice.priceString
                ).replace('{PRICE}', price_string);
            }
        }

        text = strings.View_Subscription_AYear_Text.replace(
            '{PRICE}',
            price_string
        );
    }
    return text;
}

export { getPlansString };
