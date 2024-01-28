import React, { useCallback, useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	isSubscriptionActive,
	RestorePurchasers,
} from '@expirychecker/Functions/ProMode';

import Button from '@components/Button';

import { Category, CategoryTitle } from '@views/Settings/styles';

import { Container, ButtonCancel, ButtonCancelText } from './styles';

const Pro: React.FC = () => {
	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);

	const { navigate, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();
	const [isRestoring, setIsRestoring] = useState<boolean>(false);

	const handleCancel = useCallback(async () => {
		navigate('SubscriptionCancel');
	}, [navigate]);

	const handleRestore = useCallback(async () => {
		setIsRestoring(true);

		try {
			await RestorePurchasers();

			const result = await isSubscriptionActive();

			if (result === true) {
				setUserPreferences({
					...userPreferences,
					isPRO: true,
					disableAds: true,
				});

				showMessage({
					message:
						strings.View_PROView_Subscription_Alert_RestoreSuccess,
					type: 'info',
				});

				reset({
					routes: [{ name: 'Home' }],
				});
			} else {
				showMessage({
					message:
						strings.View_PROView_Subscription_Alert_NoSubscription,
					type: 'warning',
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			}
		} finally {
			setIsRestoring(false);
		}
	}, [reset, setUserPreferences, userPreferences]);

	return (
		<Container>
			<Category>
				<CategoryTitle>
					{strings.View_Settings_CategoryName_Pro}
				</CategoryTitle>

				{!userPreferences.isPRO && (
					<Button
						text={strings.View_Settings_Pro_RestoreSubscription}
						isLoading={isRestoring}
						onPress={handleRestore}
					/>
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
