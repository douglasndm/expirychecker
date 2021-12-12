import { Platform } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

import strings from '~/Locales';

interface getPlansStringRequest {
    monthly: PurchasesPackage | undefined;
    quarterly: PurchasesPackage | undefined;
    annual: PurchasesPackage | undefined;
}

interface getPlansStringResponse {
    monthly: string | undefined;
    quarterly: string | undefined;
    annual: string | undefined;
}

export function getPlansString({
    monthly,
    quarterly,
    annual,
}: getPlansStringRequest): getPlansStringResponse {
    const response: getPlansStringResponse = {
        monthly: '',
        quarterly: '',
        annual: '',
    };

    if (monthly) {
        const { price_string, introPrice } = monthly.product;

        let monthlyText;

        if (Platform.OS === 'android') {
            if (introPrice) {
                monthlyText =
                    strings.View_Subscription_Monthly_WithIntroText.replace(
                        '{INTRO_PRICE}',
                        introPrice.priceString
                    ).replace('{PRICE}', price_string);
            }
        }

        monthlyText = strings.View_Subscription_Monthly_Text.replace(
            '{PRICE}',
            price_string
        );

        response.monthly = monthlyText;
    }

    if (quarterly) {
        const { price_string, introPrice } = quarterly.product;

        let quarterlyText;

        if (Platform.OS === 'android') {
            if (introPrice) {
                quarterlyText =
                    strings.View_Subscription_3Months_WithIntroText.replace(
                        '{INTRO_PRICE}',
                        introPrice.priceString
                    ).replace('{PRICE}', price_string);
            }
        }

        quarterlyText = strings.View_Subscription_3Months_Text.replace(
            '{PRICE}',
            price_string
        );

        response.quarterly = quarterlyText;
    }

    if (annual) {
        const { price_string, introPrice } = annual.product;

        let annualText;

        if (Platform.OS === 'android') {
            if (introPrice) {
                annualText =
                    strings.View_Subscription_AYear_WithIntroText.replace(
                        '{INTRO_PRICE}',
                        introPrice.priceString
                    ).replace('{PRICE}', price_string);
            }
        }

        annualText = strings.View_Subscription_AYear_Text.replace(
            '{PRICE}',
            price_string
        );

        response.annual = annualText;
    }

    return response;
}
