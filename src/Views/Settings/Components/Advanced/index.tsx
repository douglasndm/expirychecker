import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@expirychecker/Locales';

import Button from '@components/Button';

import {
	Category,
	CategoryTitle,
	SettingDescription,
} from '@views/Settings/styles';

import { Container } from './styles';

const Advanced: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const navigateToDeleteAll = useCallback(() => {
		navigate('DeleteAll');
	}, [navigate]);
	return (
		<Container>
			<Category>
				<CategoryTitle>
					{strings.View_Settings_Advanced_Title}
				</CategoryTitle>

				<SettingDescription>
					{strings.View_Settings_Advanced_DeleteAll_Description}
				</SettingDescription>

				<Button
					title={strings.View_Settings_Advanced_DeleteAll_Button}
					onPress={navigateToDeleteAll}
				/>
			</Category>
		</Container>
	);
};

export default Advanced;
