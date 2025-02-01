import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import strings from '@expirychecker/Locales';

import Purchases from '@services/RevenueCat';

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
		async (lUser: FirebaseAuthTypes.User | null) => {
			setUser(lUser);
			if (initializing) setInitializing(false);
		},
		[initializing]
	);

	const handleLogout = useCallback(async () => {
		await auth().signOut();

		if (!Purchases.isAnonymous) {
			await Purchases.logOut();
		}
	}, []);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

		return subscriber; // unsubscribe on unmount
	}, [onAuthStateChanged]);

	return (
		<Container>
			<Category>
				<CategoryTitle>
					{strings.View_Settings_Account_Title}
				</CategoryTitle>
				<SettingDescription>
					{user?.email
						? user.email
						: strings.View_Settings_Account_Description}
				</SettingDescription>

				{user && !user.isAnonymous ? (
					<Button
						title={strings.View_Settings_Account_Button_SignOut}
						onPress={handleLogout}
					/>
				) : (
					<Button
						title={strings.View_Settings_Account_Button_SignIn}
						onPress={handleNavigateLogin}
					/>
				)}
			</Category>
		</Container>
	);
};

export default Account;
