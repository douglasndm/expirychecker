import React, { useState, useEffect, useCallback, useContext } from 'react';
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
import { getEnableProVersion } from '~/Functions/Settings';
import { getPlansString } from '~/Utils/Purchases/Plans';
import { getCurrentLocale } from '~/Utils/System/getLocale';

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
    SubscriptionCostByMonth,
    DiscountLabelContainer,
    DiscountLabel,
    FirstLine,
} from './styles';
import { getFormatedPrice } from '~/Utils/System/getFormatedPrice';

const SubscriptionList: React.FC = () => {
    const { reset, replace } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPurchasing, setIsPurchasing] = useState<boolean>(false);
    const [isRestoreLoading, setIsRestoreLoading] = useState<boolean>(false);

    const [alreadyPremium, setAlreadyPremium] = useState(false);

    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<
        PurchasesPackage | undefined
    >();

    const [monthlyPrice, setMonthlyPrice] = useState(0);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const alreadyProUser = await isSubscriptionActive();
            setAlreadyPremium(alreadyProUser);

            const response = await getSubscriptionDetails();
            const sorted = response.sort((pack1, pack2) => {
                if (pack1.product.price > pack2.product.price) {
                    return -1;
                }
                if (pack1.product.price < pack2.product.price) {
                    return 1;
                }
                return 0;
            });

            setPackages(sorted);
            setSelectedPackage(sorted[0]);
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

    useEffect(() => {
        const monthlyPack = packages.find(
            p => p.packageType === PACKAGE_TYPE.MONTHLY
        );

        if (monthlyPack) {
            setMonthlyPrice(monthlyPack.product.price);
        }
    }, [packages]);

    const handleMakeSubscription = useCallback(async () => {
        if (!selectedPackage) return;
        try {
            setIsPurchasing(true);

            await makeSubscription(selectedPackage);

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
    }, [selectedPackage, setUserPreferences, userPreferences, replace]);

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

    useEffect(() => {
        loadData();
    }, [loadData]);

    const getCurrencySymbol = useCallback((currency: string) => {
        return (0)
            .toLocaleString(getCurrentLocale(), {
                style: 'currency',
                currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            })
            .replace(/\d/g, '')
            .trim();
    }, []);

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
                    {packages.length > 0 ? (
                        <Container>
                            <>
                                <SubscriptionsGroup>
                                    {packages.map(pack => {
                                        const { price } = pack.product;
                                        const currency = getCurrencySymbol(
                                            pack.product.currency_code
                                        );

                                        let priceByMonth = `${price.toLocaleString(
                                            getCurrentLocale()
                                        )} ${
                                            strings.View_Subscription_AfterMonthlyPrice
                                        }`;

                                        let discount = 0;

                                        let title = '';

                                        switch (pack.packageType) {
                                            case PACKAGE_TYPE.THREE_MONTH:
                                                title =
                                                    strings.View_ProPage_SubscribePeriod_ThreeMonths;
                                                priceByMonth = `${getFormatedPrice(
                                                    price / 3
                                                )} ${
                                                    strings.View_Subscription_AfterMonthlyPrice
                                                }`;

                                                if (monthlyPrice > 0) {
                                                    const packMonthlyPrice =
                                                        price / 3;

                                                    discount =
                                                        ((monthlyPrice -
                                                            packMonthlyPrice) /
                                                            monthlyPrice) *
                                                        100;
                                                }
                                                break;
                                            case PACKAGE_TYPE.ANNUAL:
                                                title =
                                                    strings.View_ProPage_SubscribePeriod_OneYear;
                                                priceByMonth = `${getFormatedPrice(
                                                    price / 12
                                                )} ${
                                                    strings.View_Subscription_AfterMonthlyPrice
                                                }`;

                                                if (monthlyPrice > 0) {
                                                    const packMonthlyPrice =
                                                        price / 12;

                                                    discount =
                                                        ((monthlyPrice -
                                                            packMonthlyPrice) /
                                                            monthlyPrice) *
                                                        100;
                                                }
                                                break;
                                            default:
                                                title =
                                                    strings.View_ProPage_SubscribePeriod_Monthly;
                                                break;
                                        }

                                        const isSelected =
                                            selectedPackage?.product
                                                .identifier ===
                                            pack.product.identifier;

                                        return (
                                            <SubscriptionContainer
                                                key={pack.identifier}
                                                onPress={() => {
                                                    setSelectedPackage(pack);
                                                }}
                                                isSelected={isSelected}
                                            >
                                                <SubscriptionPeriodContainer
                                                    isSelected={isSelected}
                                                >
                                                    <SubscriptionPeriod
                                                        isSelected={isSelected}
                                                    >
                                                        {title}
                                                    </SubscriptionPeriod>
                                                </SubscriptionPeriodContainer>

                                                <DetailsContainer
                                                    isSelected={isSelected}
                                                >
                                                    <FirstLine>
                                                        <SubscriptionCostByMonth
                                                            isSelected={
                                                                isSelected
                                                            }
                                                        >
                                                            {`${currency}${priceByMonth}`}
                                                        </SubscriptionCostByMonth>

                                                        {discount > 0 && (
                                                            <DiscountLabelContainer>
                                                                <DiscountLabel>
                                                                    {`${discount.toFixed(
                                                                        0
                                                                    )}% OFF`}
                                                                </DiscountLabel>
                                                            </DiscountLabelContainer>
                                                        )}
                                                    </FirstLine>

                                                    {pack.packageType !==
                                                        PACKAGE_TYPE.MONTHLY && (
                                                        <SubscriptionDescription
                                                            isSelected={
                                                                isSelected
                                                            }
                                                        >
                                                            <TextSubscription>
                                                                {getPlansString(
                                                                    pack
                                                                )}
                                                            </TextSubscription>
                                                        </SubscriptionDescription>
                                                    )}
                                                </DetailsContainer>
                                            </SubscriptionContainer>
                                        );
                                    })}
                                </SubscriptionsGroup>

                                {packages.length > 0 && (
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
