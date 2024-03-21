import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import Button from '@components/Button';

import {
	Category,
	CategoryTitle,
	SettingDescription,
} from '@views/Settings/styles';

import { Container } from './styles';

const Account: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

	const handleNavigateLogin = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	const onAuthStateChanged = useCallback(
		(lUser: FirebaseAuthTypes.User | null) => {
			setUser(lUser);
			if (initializing) setInitializing(false);
			// console.log(lUser);
		},
		[initializing]
	);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

		return subscriber; // unsubscribe on unmount
	}, [onAuthStateChanged]);

	return (
		<Container>
			<Category>
				<CategoryTitle>Account</CategoryTitle>
				<SettingDescription>
					{user?.email ? user.email : 'Not logged in'}
				</SettingDescription>

				{user ? (
					<Button title="Sign out" onPress={() => auth().signOut()} />
				) : (
					<Button title="Sign in" onPress={handleNavigateLogin} />
				)}
			</Category>
		</Container>
	);
};

export default Account;
