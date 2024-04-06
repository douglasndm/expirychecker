import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

import strings from '@expirychecker/Locales';

import Purchases from '@services/RevenueCat';

import Button from '@components/Button';

import SyncModal from '@expirychecker/Components/SyncModal';

import { isInitialSyncNeeded } from '@expirychecker/Utils/Database/Sync/Check';
import { sync } from '@expirychecker/Utils/Database/Sync/Firestore';

import {
	Category,
	CategoryTitle,
	SettingDescription,
} from '@views/Settings/styles';

import { Container } from './styles';

const Account: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [initializing, setInitializing] = useState(true);
	const [showSyncModal, setShowSyncModal] = useState(false);

	const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

	const handleNavigateLogin = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	const onAuthStateChanged = useCallback(
		async (lUser: FirebaseAuthTypes.User | null) => {
			setUser(lUser);
			if (initializing) setInitializing(false);

			if (lUser) {
				const isInitiaSyncNeeded = await isInitialSyncNeeded();

				if (isInitiaSyncNeeded) {
					setShowSyncModal(true);
				} else {
					await AsyncStorage.setItem('initialSync', 'true');
					sync();
				}
			}
		},
		[initializing]
	);

	const handleLogout = useCallback(async () => {
		await auth().signOut();

		await Purchases.logOut();

		await AsyncStorage.removeItem('initialSync');
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
					{user?.email ? user.email : 'Not logged in'}
				</SettingDescription>

				{user ? (
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

			<SyncModal
				showModal={showSyncModal}
				setShowModal={setShowSyncModal}
			/>
		</Container>
	);
};

export default Account;
