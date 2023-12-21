import React, {
	useState,
	useCallback,
	useEffect,
	useMemo,
	useContext,
} from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import { formatCurrency } from 'react-native-format-currency';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	getSubscriptionDetails,
	makeSubscription,
} from '@expirychecker/Functions/ProMode';

import Loading from '@components/Loading';

import Header from './Header';
import Footer from './Footer';

import {
	Container,
	Content,
	AdvantagesContainer,
	Advantage,
	PriceContainer,
	Price,
	PriceMonthly,
	PricePeriod,
	PeriodContainer,
	Period,
	PeriodText,
	ButtonContainer,
	ButtonText,
	ButtonLoading,
	AdvantageCheck,
	AdvantageContent,
	ActionsContainer,
	ContainerStoreNotAvailable,
	TextStoreNotAvailable,
} from './styles';

const Pro: React.FC = () => {
	const { replace } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isPurchasing, setIsPurchasing] = useState<boolean>(false);

	const [packages, setPackages] = useState<PurchasesPackage[]>([]);
	const [selectedPackage, setSelectedPackage] = useState<
		PurchasesPackage | undefined
	>();

	const [selectedPlan, setSelectedPlan] = useState<
		'monthly' | 'quarterly' | 'yearly'
	>('yearly');

	const periodString = useMemo(() => {
		if (selectedPlan === 'monthly') {
			return strings.View_Subscription_AfterMonthlyPrice;
		}
		if (selectedPlan === 'quarterly') {
			return strings.View_Subscription_AfterFullPrice_ThreeMonths;
		}
		if (selectedPlan === 'yearly') {
			return strings.View_Subscription_AfterFullPrice;
		}

		return strings.View_Subscription_AfterFullPrice;
	}, [selectedPlan]);

	const monthlyString = useMemo(() => {
		const price = selectedPackage?.product.price;
		if (selectedPlan === 'yearly') {
			if (price) {
				const priceMonth = price / 12;

				const formated = formatCurrency({
					amount: priceMonth,
					code: selectedPackage.product.currencyCode,
				});
				return `${formated[2]}${priceMonth.toFixed(2)}`;
			}
		} else if (selectedPlan === 'quarterly') {
			if (price) {
				const priceMonth = price / 3;

				const formated = formatCurrency({
					amount: priceMonth,
					code: selectedPackage.product.currencyCode,
				});
				return `${formated[2]}${priceMonth.toFixed(2)}`;
			}
		}

		return '';
	}, [selectedPackage?.product, selectedPlan]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
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
		} finally {
			setIsLoading(false);
		}
	}, []);

	const handlePurchase = useCallback(async () => {
		if (!selectedPackage) return;
		try {
			setIsPurchasing(true);

			const response = await makeSubscription(selectedPackage);

			setUserPreferences({
				...userPreferences,
				isPRO: response,
				disableAds: response,
			});

			if (response) {
				showMessage({
					message: strings.View_Pro_Alert_Welcome,
					type: 'success',
				});

				replace('Home');
			}
		} catch (error) {
			if (error instanceof Error)
				showMessage({
					message: error.message,
					type: 'danger',
				});
		} finally {
			setIsPurchasing(false);
		}
	}, [replace, selectedPackage, setUserPreferences, userPreferences]);

	useEffect(() => {
		if (selectedPlan === 'monthly') {
			const pack = packages.find(
				p => p.packageType === PACKAGE_TYPE.MONTHLY
			);
			setSelectedPackage(pack);
		} else if (selectedPlan === 'quarterly') {
			const pack = packages.find(
				p => p.packageType === PACKAGE_TYPE.THREE_MONTH
			);
			setSelectedPackage(pack);
		} else if (selectedPlan === 'yearly') {
			const pack = packages.find(
				p => p.packageType === PACKAGE_TYPE.ANNUAL
			);
			setSelectedPackage(pack);
		}
	}, [packages, selectedPlan]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<StatusBar backgroundColor="#9159c1" />
			<Content>
				<ScrollView>
					<Header />

					<AdvantagesContainer>
						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageOne}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageTwo}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageThree}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageFour}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageFive}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageSix}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>

						<AdvantageContent>
							<Advantage>
								{strings.View_ProPage_AdvantageSeven}
							</Advantage>
							<AdvantageCheck>✓</AdvantageCheck>
						</AdvantageContent>
					</AdvantagesContainer>

					{packages.length > 0 ? (
						<ActionsContainer>
							<PriceContainer>
								<Price>
									{selectedPackage?.product.priceString}{' '}
									<PricePeriod>/ {periodString}</PricePeriod>
								</Price>
								{selectedPlan !== 'monthly' && (
									<PriceMonthly>
										{`${strings.View_Pro_BeforeMonthlyPrice} ${monthlyString} `}

										<PricePeriod>
											{`/ ${strings.View_Subscription_AfterMonthlyPrice}`}
										</PricePeriod>
									</PriceMonthly>
								)}
							</PriceContainer>

							<PeriodContainer>
								<Period
									isSelected={selectedPlan === 'yearly'}
									onPress={() => {
										setSelectedPlan(`yearly`);
									}}
								>
									<PeriodText>
										{
											strings.View_ProPage_SubscribePeriod_OneYear
										}
									</PeriodText>
								</Period>
								<Period
									isSelected={selectedPlan === 'quarterly'}
									onPress={() => setSelectedPlan(`quarterly`)}
								>
									<PeriodText>
										{
											strings.View_ProPage_SubscribePeriod_ThreeMonths
										}
									</PeriodText>
								</Period>
								<Period
									isSelected={selectedPlan === 'monthly'}
									onPress={() => setSelectedPlan(`monthly`)}
								>
									<PeriodText>
										{
											strings.View_ProPage_SubscribePeriod_Monthly
										}
									</PeriodText>
								</Period>
							</PeriodContainer>

							<ButtonContainer
								onPress={handlePurchase}
								disabled={isPurchasing}
							>
								{isPurchasing ? (
									<ButtonLoading />
								) : (
									<ButtonText>
										{
											strings.View_Subscription_Button_Subscribe
										}
									</ButtonText>
								)}
							</ButtonContainer>
						</ActionsContainer>
					) : (
						<ContainerStoreNotAvailable disabled>
							<TextStoreNotAvailable>
								{strings.View_ProPage_SubscriptionNotAvailable}
							</TextStoreNotAvailable>
						</ContainerStoreNotAvailable>
					)}

					<Footer />
				</ScrollView>
			</Content>
		</Container>
	);
};

export default Pro;
