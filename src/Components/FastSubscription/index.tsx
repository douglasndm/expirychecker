import React, {
    useState,
    useCallback,
    useEffect,
    useMemo,
    useContext,
} from 'react';
import { Linking, Platform } from 'react-native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import { showMessage } from 'react-native-flash-message';
import { getSubscriptionDetails, makeSubscription } from '~/Functions/ProMode';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getEnableProVersion } from '~/Functions/Settings';

import Loading from '../Loading';
import Button from '../Button';

import {
    TermsPrivacyLink,
    TermsPrivacyText,
} from '~/Views/ProSubscription/styles';

import {
    Container,
    SubCardContainer,
    SubCardText,
    SubscriptionText,
    SubscriptionTextContainer,
} from './styles';

const FastSubscription: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

    const [monthlyPlan, setMonthlyPlan] = useState<
        PurchasesPackage | undefined
    >();

    const monthlyString = useMemo(() => {
        let string = '';

        if (monthlyPlan) {
            const { price_string, introPrice } = monthlyPlan.product;

            if (Platform.OS === 'android') {
                if (introPrice) {
                    string =
                        strings.View_Subscription_Monthly_WithIntroText.replace(
                            '{INTRO_PRICE}',
                            introPrice.priceString
                        ).replace('{PRICE}', price_string);
                }
            }

            string = strings.View_Subscription_Monthly_Text.replace(
                '{PRICE}',
                price_string
            );
        }
        return string;
    }, [monthlyPlan]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getSubscriptionDetails();

            response.forEach(packageItem => {
                if (packageItem.packageType === PACKAGE_TYPE.MONTHLY) {
                    setMonthlyPlan(packageItem);
                }
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const subscribe = useCallback(async () => {
        try {
            setIsLoading(true);

            if (!monthlyPlan) {
                return;
            }

            await makeSubscription(monthlyPlan);

            const enablePro = await getEnableProVersion();

            setUserPreferences({
                ...userPreferences,
                isUserPremium: enablePro,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [monthlyPlan, setUserPreferences, userPreferences]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <SubCardContainer>
                    <SubCardText>{monthlyString}</SubCardText>
                </SubCardContainer>

                <SubscriptionTextContainer>
                    <SubscriptionText>
                        {strings.Component_FastSub_Text}
                    </SubscriptionText>
                </SubscriptionTextContainer>

                <Button
                    text={strings.View_ProPage_Button_Subscribe}
                    onPress={subscribe}
                    isLoading={isLoading}
                />
            </Container>
            <TermsPrivacyText>
                {strings.View_ProPage_Text_BeforeTermsAndPrivacy}
                <TermsPrivacyLink onPress={navigateToTerms}>
                    {strings.Terms}
                </TermsPrivacyLink>
                {strings.BetweenTermsAndPrivacy}
                <TermsPrivacyLink onPress={navigateToPrivacy}>
                    {strings.PrivacyPolicy}
                </TermsPrivacyLink>
                .
            </TermsPrivacyText>
        </>
    );
};

export default FastSubscription;
