import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@expirychecker/Locales';

import { Category, CategoryTitle } from '@views/Settings/styles';

import { Container, ButtonCancel, ButtonCancelText } from './styles';

const Pro: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleCancel = useCallback(async () => {
		navigate('SubscriptionCancel');
	}, [navigate]);

	return (
		<Container>
			<Category>
				<CategoryTitle>
					{strings.View_Settings_CategoryName_Pro}
				</CategoryTitle>

				<ButtonCancel onPress={handleCancel}>
					<ButtonCancelText>
						{strings.View_Settings_Button_CancelSubscribe}
					</ButtonCancelText>
				</ButtonCancel>
			</Category>
		</Container>
	);
};

export default Pro;
