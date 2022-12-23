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

import Loading from '@components/Loading';
import Button from '@components/Button';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getEnableProVersion } from '~/Functions/Settings';
import { getSubscriptionDetails, makeSubscription } from '~/Functions/ProMode';

import {
	TermsPrivacyLink,
	TermsPrivacyText,
} from '~/Views/ProSubscription/styles';

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

	const [monthlyPlan, setMonthlyPlan] = useState<
		PurchasesPackage | undefined
	>();

	const monthlyString = useMemo(() => {
		let string = '';

		if (monthlyPlan) {
			const { priceString } = monthlyPlan.product;

			string = strings.Component_FastSub_Price.replace(
				'{PRICE}',
				priceString
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
	}, [monthlyPlan, setUserPreferences, userPreferences]);

	return isLoading ? (
		<Loading disableText />
	) : (
		<>
			{monthlyPlan && (
				<FastSubContainer>
					<Container>
						<SubscriptionTextContainer>
							<SubscriptionText>
								{strings.Component_FastSub_Text}
							</SubscriptionText>

							<SubscriptionText>{monthlyString}</SubscriptionText>
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
				</FastSubContainer>
			)}
		</>
	);
};

export default FastSubscription;
