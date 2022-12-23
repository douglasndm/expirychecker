import React, { useCallback, useContext, useMemo } from 'react';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@components/Button';

import { Category, CategoryTitle } from '@views/Settings/styles';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { isSubscriptionActive } from '~/Functions/ProMode';

import { Container, ButtonCancel, ButtonCancelText } from './styles';

const Pro: React.FC = () => {
	const { userPreferences } = useContext(PreferencesContext);

	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const cancelSubscriptionLink = useMemo(() => {
		return Platform.OS === 'ios'
			? 'https://apps.apple.com/account/subscriptions'
			: 'https://play.google.com/store/account/subscriptions?sku=controledevalidade_pro_monthly&package=com.controledevalidade';
	}, []);

	const handleCancel = useCallback(async () => {
		await Linking.openURL(cancelSubscriptionLink);

		if (!(await isSubscriptionActive())) {
			reset({
				routes: [{ name: 'Home' }],
			});
		}
	}, [reset, cancelSubscriptionLink]);

	const navigateToPremiumView = useCallback(() => {
		navigate('Pro');
	}, [navigate]);

	return (
		<Container>
			<Category>
				<CategoryTitle>
					{strings.View_Settings_CategoryName_Pro}
				</CategoryTitle>

				{!userPreferences.isPRO && (
					<>
						<Button
							text={
								strings.View_Settings_Button_BecobeProToUnlockNewFeatures
							}
							onPress={navigateToPremiumView}
						/>
					</>
				)}

				{userPreferences.isPRO && (
					<ButtonCancel onPress={handleCancel}>
						<ButtonCancelText>
							{strings.View_Settings_Button_CancelSubscribe}
						</ButtonCancelText>
					</ButtonCancel>
				)}
			</Category>
		</Container>
	);
};

export default Pro;
