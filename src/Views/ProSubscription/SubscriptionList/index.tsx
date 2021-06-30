import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';

import {
    getSubscriptionDetails,
    makeSubscription,
    isSubscriptionActive,
    RestorePurchasers,
} from '~/Functions/ProMode';

import {
    Container,
    SubscriptionsGroup,
    SubscriptionContainer,
    SubscriptionPeriodContainer,
    SubscriptionPeriod,
    SubscriptionDescription,
    DetailsContainer,
    ButtonSubscription,
    ButtonText,
    TextSubscription,
    LoadingIndicator,
} from './styles';

const SubscriptionList: React.FC = () => {
    const { reset } = useNavigation();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
    const [isRestoreLoading, setIsRestoreLoading] = useState<boolean>(false);

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState<
        'monthly' | 'quarterly' | 'annual'
    >('monthly');

    const [monthlyPlan, setMonthlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [quarterlyPlan, setQuarterlyPlan] = useState<
        PurchasesPackage | undefined
    >();
    const [annualPlan, setAnnualPlan] = useState<
        PurchasesPackage | undefined
    >();

    const monthlyString = useMemo(() => {
        let string = '';

        if (monthlyPlan) {
            const { price_string, introPrice } = monthlyPlan.product;

            if (Platform.OS === 'android') {
                if (introPrice) {
                    string = strings.View_Subscription_Monthly_WithIntroText.replace(
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

    const quarterlyString = useMemo(() => {
        let string = '';
        if (quarterlyPlan) {
            const { price_string, introPrice } = quarterlyPlan.product;

            if (Platform.OS === 'android') {
                if (introPrice) {
                    string = strings.View_Subscription_3Months_WithIntroText.replace(
                        '{INTRO_PRICE}',
                        introPrice.priceString
                    ).replace('{PRICE}', price_string);
                }
            }

            string = strings.View_Subscription_3Months_Text.replace(
                '{PRICE}',
                price_string
            );
        }
        return string;
    }, [quarterlyPlan]);

    const annualString = useMemo(() => {
        let string = '';
        if (annualPlan) {
            const { price_string, introPrice } = annualPlan.product;

            if (Platform.OS === 'android') {
                if (introPrice) {
                    string = strings.View_Subscription_AYear_WithIntroText.replace(
                        '{INTRO_PRICE}',
                        introPrice.priceString
                    ).replace('{PRICE}', price_string);
                }
            }

            string = strings.View_Subscription_AYear_Text.replace(
                '{PRICE}',
                price_string
            );
        }
        return string;
    }, [annualPlan]);

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
            setIsPurchasing(true);

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

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            if (err.message === 'User cancel payment') {
                return;
            }

            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsPurchasing(false);
        }
    }, [
        selectedPlan,
        setUserPreferences,
        userPreferences,
        reset,
        annualPlan,
        quarterlyPlan,
        monthlyPlan,
    ]);

    const handleRestore = useCallback(async () => {
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

            reset({
                routes: [{ name: 'Home' }],
            });
        } else {
            showMessage({
                message: strings.View_PROView_Subscription_Alert_NoSubscription,
                type: 'info',
            });
        }
        setIsRestoreLoading(false);
    }, [setUserPreferences, userPreferences, reset]);

    const handleChangePlanMonthly = useCallback(() => {
        setSelectedPlan('monthly');
    }, []);

    const handleChangePlanQuarterly = useCallback(() => {
        setSelectedPlan('quarterly');
    }, []);

    const handleChangePlanAnnual = useCallback(() => {
        setSelectedPlan('annual');
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading || isPurchasing ? (
        <Loading />
    ) : (
        <>
            {alreadyPremium ? (
                <ButtonSubscription>
                    <TextSubscription>
                        {strings.View_ProPage_UserAlreadyPro}
                    </TextSubscription>
                </ButtonSubscription>
            ) : (
                <>
                    {monthlyPlan || quarterlyPlan || annualPlan ? (
                        <Container>
                            <>
                                <SubscriptionsGroup>
                                    {monthlyPlan && (
                                        <SubscriptionContainer
                                            onPress={handleChangePlanMonthly}
                                            isSelected={
                                                selectedPlan === 'monthly'
                                            }
                                        >
                                            <SubscriptionPeriodContainer
                                                isSelected={
                                                    selectedPlan === 'monthly'
                                                }
                                            >
                                                <SubscriptionPeriod>
                                                    {
                                                        strings.View_ProPage_SubscribePeriod_Monthly
                                                    }
                                                </SubscriptionPeriod>
                                            </SubscriptionPeriodContainer>

                                            <DetailsContainer
                                                isSelected={
                                                    selectedPlan === 'monthly'
                                                }
                                            >
                                                <SubscriptionDescription
                                                    isSelected={
                                                        selectedPlan ===
                                                        'monthly'
                                                    }
                                                >
                                                    <TextSubscription>
                                                        {monthlyString}
                                                    </TextSubscription>
                                                </SubscriptionDescription>
                                            </DetailsContainer>
                                        </SubscriptionContainer>
                                    )}

                                    {quarterlyPlan && (
                                        <SubscriptionContainer
                                            onPress={handleChangePlanQuarterly}
                                            isSelected={
                                                selectedPlan === 'quarterly'
                                            }
                                            style={{
                                                marginLeft: 10,
                                                marginRight: 10,
                                            }}
                                        >
                                            <SubscriptionPeriodContainer
                                                isSelected={
                                                    selectedPlan === 'quarterly'
                                                }
                                            >
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
                                                        selectedPlan ===
                                                            'quarterly'
                                                    }
                                                >
                                                    <TextSubscription>
                                                        {quarterlyString}
                                                    </TextSubscription>
                                                </SubscriptionDescription>
                                            </DetailsContainer>
                                        </SubscriptionContainer>
                                    )}

                                    {annualPlan && (
                                        <SubscriptionContainer
                                            onPress={handleChangePlanAnnual}
                                            isSelected={
                                                selectedPlan === 'annual'
                                            }
                                        >
                                            <SubscriptionPeriodContainer
                                                isSelected={
                                                    selectedPlan === 'annual'
                                                }
                                            >
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
                                                        selectedPlan ===
                                                            'annual'
                                                    }
                                                >
                                                    <TextSubscription>
                                                        {annualString}
                                                    </TextSubscription>
                                                </SubscriptionDescription>
                                            </DetailsContainer>
                                        </SubscriptionContainer>
                                    )}
                                </SubscriptionsGroup>

                                {(monthlyPlan ||
                                    quarterlyPlan ||
                                    annualPlan) && (
                                    <>
                                        <ButtonSubscription
                                            onPress={handleMakeSubscription}
                                            disabled={
                                                isPurchasing || isRestoreLoading
                                            }
                                        >
                                            {isPurchasing ? (
                                                <LoadingIndicator />
                                            ) : (
                                                <ButtonText>
                                                    {
                                                        strings.View_ProPage_Button_Subscribe
                                                    }
                                                </ButtonText>
                                            )}
                                        </ButtonSubscription>
                                        <ButtonSubscription
                                            onPress={handleRestore}
                                            disabled={
                                                isPurchasing || isRestoreLoading
                                            }
                                        >
                                            {isRestoreLoading ? (
                                                <LoadingIndicator />
                                            ) : (
                                                <TextSubscription
                                                    style={{ color: '#fff' }}
                                                >
                                                    {
                                                        strings.View_PROView_Subscription_RestoreButton
                                                    }
                                                </TextSubscription>
                                            )}
                                        </ButtonSubscription>
                                    </>
                                )}
                            </>
                        </Container>
                    ) : (
                        <ButtonSubscription disabled>
                            <TextSubscription>
                                {strings.View_ProPage_SubscriptionNotAvailable}
                            </TextSubscription>
                        </ButtonSubscription>
                    )}
                </>
            )}
        </>
    );
};

export default SubscriptionList;
