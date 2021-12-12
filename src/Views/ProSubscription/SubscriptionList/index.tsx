import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
import { getEnableProVersion } from '~/Functions/Settings';
import { getPlansString } from '~/Utils/Purchases/Plans';

const SubscriptionList: React.FC = () => {
    const { reset, replace } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

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

    const plansText = useMemo(() => {
        return getPlansString({
            monthly: monthlyPlan,
            quarterly: quarterlyPlan,
            annual: annualPlan,
        });
    }, [annualPlan, monthlyPlan, quarterlyPlan]);

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
            if (err instanceof Error)
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

            const enablePro = await getEnableProVersion();

            setUserPreferences({
                ...userPreferences,
                isUserPremium: enablePro,
                disableAds: enablePro,
            });

            if (enablePro) {
                replace('Home');
            }
        } catch (err) {
            if (err instanceof Error)
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
        annualPlan,
        quarterlyPlan,
        monthlyPlan,
        replace,
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
                                                        {plansText.monthly}
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
                                                        {plansText.quarterly}
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
                                                        {plansText.annual}
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
