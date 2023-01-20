import React, {
	useState,
	useCallback,
	useEffect,
	useMemo,
	useContext,
} from 'react';
import { Linking } from 'react-native';
import { PACKAGE_TYPE, PurchasesPackage } from 'react-native-purchases';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getEnableProVersion } from '@expirychecker/Functions/Settings';
import {
	getSubscriptionDetails,
	makeSubscription,
} from '@expirychecker/Functions/ProMode';

import Loading from '@components/Loading';
import Button from '@components/Button';

import {
	TermsPrivacyLink,
	TermsPrivacyText,
} from '@expirychecker/Views/ProSubscription/styles';

import {
	FastSubContainer,
	Container,
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

	const [plan, setPlan] = useState<PurchasesPackage | undefined>();

	const monthlyString = useMemo(() => {
		let string = '';

		if (plan) {
			const { priceString, introPrice, price } = plan.product;

			if (introPrice) {
				if (introPrice?.periodNumberOfUnits > 0) {
					const packMonthlyPrice = price / 12;

					string = strings.Component_FastSub_TextWithTrial.replace(
						'{DAYS}',
						String(introPrice?.periodNumberOfUnits)
					)
						.replace('{PRICE_MONTH}', packMonthlyPrice.toFixed(2))
						.replace('{PRICE}', priceString);
				}
			} else {
				string = strings.Component_FastSub_Text.replace(
					'{PRICE}',
					priceString
				);
			}
		}
		return string;
	}, [plan]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const response = await getSubscriptionDetails();

			response.forEach(packageItem => {
				if (packageItem.packageType === PACKAGE_TYPE.ANNUAL) {
					console.log(packageItem);
					setPlan(packageItem);
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

			if (!plan) {
				return;
			}

			await makeSubscription(plan);

			const enablePro = await getEnableProVersion();

			if (enablePro && !__DEV__) {
				Analytics().logEvent(
					'subscription_from_fast_component_homepage'
				);
			}

			setUserPreferences({
				...userPreferences,
				isPRO: enablePro,
				disableAds: enablePro,
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
	}, [plan, setUserPreferences, userPreferences]);

	return isLoading ? (
		<Loading disableText />
	) : (
		<>
			{plan && (
				<FastSubContainer>
					<Container>
						<SubscriptionTextContainer>
							<SubscriptionText>{monthlyString}</SubscriptionText>
						</SubscriptionTextContainer>

						<Button
							text={strings.View_ProPage_Button_Subscribe}
							onPress={subscribe}
							isLoading={isLoading}
							contentStyle={{ backgroundColor: '#ffffff' }}
							textStyle={{ color: '#000000' }}
						/>
					</Container>
					<TermsPrivacyText>
						{strings.View_Subscription_Disclaim_IntroPrice}
					</TermsPrivacyText>
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
				</FastSubContainer>
			)}
		</>
	);
};

export default FastSubscription;
