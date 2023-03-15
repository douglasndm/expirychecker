import React, { useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Button from '@components/Button';

import { Category, CategoryTitle } from '@views/Settings/styles';

import { Container, ButtonCancel, ButtonCancelText } from './styles';

const Pro: React.FC = () => {
	const { userPreferences } = useContext(PreferencesContext);

	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleCancel = useCallback(async () => {
		navigate('SubscriptionCancel');
	}, [navigate]);

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
