import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Linking, Platform, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';

import strings from '~/Locales';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
    RestorePurchasers,
} from '~/Functions/ProMode';

import Loading from '~/Components/Loading';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
    LoadingIndicator,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    SubscriptionPeriod,
    DetailsContainer,
    SubscriptionDescription,
    SubscriptionPrice,
    SubscriptionIntroPrice,
    TermsPrivacyText,
    TermsPrivacyLink,
} from './styles';

const Pro: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRestoreLoading, setIsRestoreLoading] = useState<boolean>(false);

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [isLoadingMakeSubscription, setIsLoadingMakeSubscription] = useState<
        boolean
    >(false);
    const [selectedPlan, setSelectedPlan] = useState<string | undefined>();

    const [monthlyPlan, setMonthlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [quarterlyPlan, setQuarterlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [annualPlan, setAnnualPlan] = useState<
        PurchasesPackage | undefined
    >();

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const { navigate } = useNavigation();

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();

            response.forEach(packageItem => {
                if (packageItem.packageType === PACKAGE_TYPE.MONTHLY) {
                    setMonthlyPlan(packageItem);
                    return;
                }
                if (packageItem.packageType === PACKAGE_TYPE.THREE_MONTH) {
                    setQuarterlyPlan(packageItem);
                    return;
                }

                if (packageItem.packageType === PACKAGE_TYPE.ANNUAL) {
                    setAnnualPlan(packageItem);
                }
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleMakeSubscription = useCallback(async () => {
        try {
            setIsLoadingMakeSubscription(true);
            if (
                selectedPlan !== 'annual' &&
                selectedPlan !== 'quarterly' &&
                selectedPlan !== 'monthly'
            ) {
                showMessage({
                    message: 'Selecione o plano',
                    type: 'danger',
                });
                return;
            }

            let plan = null;

            if (selectedPlan === 'annual') {
                plan = annualPlan;
            } else if (selectedPlan === 'quarterly') {
                plan = quarterlyPlan;
            } else if (selectedPlan === 'monthly') {
                plan = monthlyPlan;
            }
            if (!plan) {
                throw new Error('Plan dint found');
            }

            await makeSubscription(plan);

            setUserPreferences({
                ...userPreferences,
                isUserPremium: true,
            });

            navigate('Home');
        } catch (err) {
            if (err.message === 'User cancel payment') {
                return;
            }

            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoadingMakeSubscription(false);
        }
    }, [
        selectedPlan,
        setUserPreferences,
        userPreferences,
        navigate,
        annualPlan,
        quarterlyPlan,
        monthlyPlan,
    ]);

    const handleNavigateHome = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleChangePlanMonthly = useCallback(() => {
        setSelectedPlan('monthly');
    }, []);

    const handleChangePlanQuarterly = useCallback(() => {
        setSelectedPlan('quarterly');
    }, []);

    const handleChangePlanAnnual = useCallback(() => {
        setSelectedPlan('annual');
    }, []);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    const restoreSubscription = useCallback(async () => {
        setIsRestoreLoading(true);
        await RestorePurchasers();

        const result = await isSubscriptionActive();

        if (result === true) {
            setUserPreferences({
                ...userPreferences,
                isUserPremium: true,
            });

            showMessage({
                message: strings.View_PROView_Subscription_Alert_RestoreSuccess,
                type: 'info',
            });

            handleNavigateHome();
        } else {
            showMessage({
                message: strings.View_PROView_Subscription_Alert_NoSubscription,
                type: 'info',
            });
        }
        setIsRestoreLoading(false);
    }, [setUserPreferences, userPreferences, handleNavigateHome]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <HeaderContainer>
                    <TitleContainer>
                        <IntroductionText>
                            {strings.View_ProPage_MeetPRO}
                        </IntroductionText>
                        <AppNameTitle>{strings.AppName}</AppNameTitle>
                        <PremiumTitle>
                            {strings.View_ProPage_ProLabel}
                        </PremiumTitle>
                    </TitleContainer>
                </HeaderContainer>

                <AdvantagesGroup>
                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageOne}
                        </AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageSeven}
                        </AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageTwo}
                        </AdvantageText>
                    </AdvantageContainer>

                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageThree}
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageFour}
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageSix}
                        </AdvantageText>
                    </AdvantageContainer>
                    <AdvantageContainer>
                        <AdvantageText>
                            {strings.View_ProPage_AdvantageFive}
                        </AdvantageText>
                    </AdvantageContainer>
                </AdvantagesGroup>

                <>
                    {alreadyPremium ? (
                        <ButtonSubscription>
                            <TextSubscription>
                                {strings.View_ProPage_UserAlreadyPro}
                            </TextSubscription>
                        </ButtonSubscription>
                    ) : (
                        <>
                            <SubscriptionsGroup>
                                {monthlyPlan && (
                                    <SubscriptionContainer
                                        onPress={handleChangePlanMonthly}
                                        isSelected={
                                            !!selectedPlan &&
                                            selectedPlan === 'monthly'
                                        }
                                    >
                                        <SubscriptionPeriodContainer>
                                            <SubscriptionPeriod>
                                                {
                                                    strings.View_ProPage_SubscribePeriod_Monthly
                                                }
                                            </SubscriptionPeriod>
                                        </SubscriptionPeriodContainer>

                                        <DetailsContainer>
                                            <SubscriptionDescription
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'monthly'
                                                }
                                            >
                                                {monthlyPlan.product
                                                    .intro_price === 0 &&
                                                Platform.OS === 'android' ? (
                                                    monthlyPlan.product
                                                        .intro_price_period_unit ===
                                                        'DAY' && (
                                                        <Text>
                                                            {
                                                                monthlyPlan
                                                                    .product
                                                                    .intro_price_period_number_of_units
                                                            }
                                                            {
                                                                strings.View_ProPage_AfterDaysFreeTest
                                                            }
                                                        </Text>
                                                    )
                                                ) : (
                                                    <SubscriptionIntroPrice
                                                        isSelected={
                                                            !!selectedPlan &&
                                                            selectedPlan ===
                                                                'monthly'
                                                        }
                                                    >
                                                        {
                                                            monthlyPlan.product
                                                                .intro_price_string
                                                        }
                                                    </SubscriptionIntroPrice>
                                                )}

                                                {
                                                    strings.View_ProPage_AfterIntroPrice_Monthly
                                                }
                                                <SubscriptionPrice
                                                    isSelected={
                                                        !!selectedPlan &&
                                                        selectedPlan ===
                                                            'monthly'
                                                    }
                                                >
                                                    {
                                                        monthlyPlan.product
                                                            .price_string
                                                    }
                                                </SubscriptionPrice>
                                                {
                                                    strings.View_ProPage_AfterPrice_Monthly
                                                }
                                            </SubscriptionDescription>
                                        </DetailsContainer>
                                    </SubscriptionContainer>
                                )}

                                {quarterlyPlan && (
                                    <SubscriptionContainer
                                        onPress={handleChangePlanQuarterly}
                                        isSelected={
                                            !!selectedPlan &&
                                            selectedPlan === 'quarterly'
                                        }
                                        style={{
                                            marginLeft: 10,
                                            marginRight: 10,
                                        }}
                                    >
                                        <SubscriptionPeriodContainer>
                                            <SubscriptionPeriod>
                                                {
                                                    strings.View_ProPage_SubscribePeriod_ThreeMonths
                                                }
                                            </SubscriptionPeriod>
                                        </SubscriptionPeriodContainer>

                                        <DetailsContainer>
                                            <SubscriptionDescription
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'quarterly'
                                                }
                                            >
                                                {!!quarterlyPlan.product
                                                    .intro_price_string && (
                                                    <SubscriptionIntroPrice
                                                        isSelected={
                                                            !!selectedPlan &&
                                                            selectedPlan ===
                                                                'quarterly'
                                                        }
                                                    >
                                                        {
                                                            quarterlyPlan
                                                                .product
                                                                .intro_price_string
                                                        }
                                                        {
                                                            strings.View_ProPage_AfterIntroPrice_ThreeMonths
                                                        }
                                                    </SubscriptionIntroPrice>
                                                )}
                                                <SubscriptionPrice
                                                    isSelected={
                                                        !!selectedPlan &&
                                                        selectedPlan ===
                                                            'quarterly'
                                                    }
                                                >
                                                    {
                                                        quarterlyPlan.product
                                                            .price_string
                                                    }
                                                </SubscriptionPrice>
                                                {
                                                    strings.View_ProPage_AfterPrice_ThreeMonths
                                                }
                                            </SubscriptionDescription>
                                        </DetailsContainer>
                                    </SubscriptionContainer>
                                )}

                                {annualPlan && (
                                    <SubscriptionContainer
                                        onPress={handleChangePlanAnnual}
                                        isSelected={
                                            !!selectedPlan &&
                                            selectedPlan === 'annual'
                                        }
                                    >
                                        <SubscriptionPeriodContainer isSelected>
                                            <SubscriptionPeriod>
                                                {
                                                    strings.View_ProPage_SubscribePeriod_OneYear
                                                }
                                            </SubscriptionPeriod>
                                        </SubscriptionPeriodContainer>
                                        <DetailsContainer>
                                            <SubscriptionDescription
                                                isSelected={
                                                    !!selectedPlan &&
                                                    selectedPlan === 'annual'
                                                }
                                            >
                                                {!!annualPlan.product
                                                    .intro_price_string && (
                                                    <SubscriptionIntroPrice>
                                                        {
                                                            annualPlan.product
                                                                .intro_price_string
                                                        }
                                                        {
                                                            strings.View_ProPage_AfterIntroPrice_OneYear
                                                        }
                                                    </SubscriptionIntroPrice>
                                                )}

                                                <SubscriptionPrice
                                                    isSelected={
                                                        !!selectedPlan &&
                                                        selectedPlan ===
                                                            'annual'
                                                    }
                                                >
                                                    {
                                                        annualPlan.product
                                                            .price_string
                                                    }
                                                </SubscriptionPrice>
                                                {
                                                    strings.View_ProPage_AfterPrice_OneYear
                                                }
                                            </SubscriptionDescription>
                                        </DetailsContainer>
                                    </SubscriptionContainer>
                                )}
                            </SubscriptionsGroup>

                            <TermsPrivacyText>
                                {
                                    strings.View_ProPage_Text_BeforeTermsAndPrivacy
                                }
                                <TermsPrivacyLink onPress={navigateToTerms}>
                                    {strings.Terms}
                                </TermsPrivacyLink>
                                {strings.BetweenTermsAndPrivacy}
                                <TermsPrivacyLink onPress={navigateToPrivacy}>
                                    {strings.PrivacyPolicy}
                                </TermsPrivacyLink>
                                .
                            </TermsPrivacyText>
                            {monthlyPlan || quarterlyPlan || annualPlan ? (
                                <ButtonSubscription
                                    onPress={handleMakeSubscription}
                                    disabled={
                                        isLoadingMakeSubscription ||
                                        isRestoreLoading
                                    }
                                >
                                    {isLoadingMakeSubscription && (
                                        <LoadingIndicator />
                                    )}
                                    {!isLoadingMakeSubscription && (
                                        <>
                                            <TextSubscription>
                                                {
                                                    strings.View_ProPage_Button_Subscribe
                                                }
                                            </TextSubscription>
                                        </>
                                    )}
                                </ButtonSubscription>
                            ) : (
                                <ButtonSubscription disabled>
                                    <TextSubscription>
                                        {
                                            strings.View_ProPage_SubscriptionNotAvailable
                                        }
                                    </TextSubscription>
                                </ButtonSubscription>
                            )}
                            <ButtonSubscription
                                onPress={restoreSubscription}
                                disabled={
                                    isLoadingMakeSubscription ||
                                    isRestoreLoading
                                }
                            >
                                {isRestoreLoading ? (
                                    <LoadingIndicator />
                                ) : (
                                    <TextSubscription>
                                        {
                                            strings.View_PROView_Subscription_RestoreButton
                                        }
                                    </TextSubscription>
                                )}
                            </ButtonSubscription>
                        </>
                    )}
                </>

                <ButtonSubscription onPress={handleNavigateHome}>
                    <TextSubscription>
                        {strings.View_ProPage_Button_GoBackToHome}
                    </TextSubscription>
                </ButtonSubscription>
            </Container>
        </>
    );
};

export default Pro;
