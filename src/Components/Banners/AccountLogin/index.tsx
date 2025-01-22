import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { Container, Icon, TextContainer, Text } from './styles';

const AccountLogin: React.FC = () => {
	const { navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const [shouldShow, setShouldShow] = useState(false);

	const loadData = useCallback(async () => {
		if (!userPreferences.isPRO || auth().currentUser) {
			setShouldShow(false);
			return;
		}

		setShouldShow(true);
	}, [userPreferences.isPRO]);

	const handleNavigate = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		const unsubscribe = addListener('focus', loadData);

		return () => unsubscribe();
	}, [addListener, loadData]);

	return shouldShow ? (
		<Container onPress={handleNavigate}>
			<Icon name="person-circle-outline" />
			<TextContainer>
				<Text>{strings.Component_AccountLoginRequest_Text}</Text>
			</TextContainer>
		</Container>
	) : (
		<></>
	);
};

export default AccountLogin;
