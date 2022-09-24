import { Platform } from 'react-native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import strings from '~/Locales';

function getPlansString(pack: PurchasesPackage, per_month?: string): string {
    const { price_string, introPrice } = pack.product;

    let text = '';

    if (pack.packageType === PACKAGE_TYPE.MONTHLY) {
        if (introPrice && introPrice.periodNumberOfUnits > 0) {
            text = strings.View_Subscription_Monthly_WithIntroTrialText;

            const days = text.replace(
                '{DAYS}',
                String(introPrice.periodNumberOfUnits)
            );
            const price = days.replace('{PRICE}', price_string);
            return price;
        }
        if (introPrice) {
            text = strings.View_Subscription_Monthly_WithIntroText;

            const intro = text.replace('{INTRO_PRICE}', introPrice.priceString);
            const price = intro.replace('{PRICE}', price_string);
            return price;
        }

        text = strings.View_Subscription_Monthly_Text.replace(
            '{PRICE}',
            price_string
        );
    } else if (pack.packageType === PACKAGE_TYPE.THREE_MONTH) {
        if (Platform.OS === 'android') {
            if (introPrice && introPrice.periodNumberOfUnits > 0) {
                text = strings.View_Subscription_3Months_WithIntroTrialText;

                const days = text.replace(
                    '{DAYS}',
                    String(introPrice.periodNumberOfUnits)
                );
                const price = days.replace('{PRICE}', price_string);
                return price;
            }
            if (introPrice) {
                text = strings.View_Subscription_3Months_WithIntroText.replace(
                    '{INTRO_PRICE}',
                    introPrice.priceString
                ).replace('{PRICE}', price_string);
            } else {
                text = strings.View_Subscription_3Months_Text.replace(
                    '{PRICE}',
                    price_string
                );
            }
        } else {
            text = strings.View_Subscription_iOS_3Months_Text.replace(
                '{PRICE}',
                per_month || price_string
            );
        }
    } else if (pack.packageType === PACKAGE_TYPE.ANNUAL) {
        if (introPrice && introPrice.periodNumberOfUnits > 0) {
            text = strings.View_Subscription_AYear_WithIntroTrialText;

            const days = text.replace(
                '{DAYS}',
                String(introPrice.periodNumberOfUnits)
            );
            const price = days.replace('{PRICE}', price_string);
            return price;
        }
        if (introPrice) {
            text = strings.View_Subscription_AYear_WithIntroText.replace(
                '{INTRO_PRICE}',
                introPrice.priceString
            ).replace('{PRICE}', price_string);
        } else {
            text = strings.View_Subscription_AYear_Text.replace(
                '{PRICE}',
                price_string
            );
        }
    }
    return text;
}

export { getPlansString };
