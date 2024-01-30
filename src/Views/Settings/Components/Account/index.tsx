import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@components/Button';

import {
	Category,
	CategoryTitle,
	SettingDescription,
} from '@views/Settings/styles';

import { Container } from './styles';

const Account: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const handleNavigateLogin = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	return (
		<Container>
			<Category>
				<CategoryTitle>Account</CategoryTitle>
				<SettingDescription>
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Labore officiis omnis ab quibusdam illo laborum ducimus nisi
					optio! Perspiciatis atque, voluptatibus dignissimos deleniti
					eum praesentium sequi culpa. Repellat, aspernatur ab!
				</SettingDescription>

				<Button title="Sign in" onPress={handleNavigateLogin} />
			</Category>
		</Container>
	);
};

export default Account;
