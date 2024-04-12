import React, { useCallback, useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { Container, Icon, TextContainer, Text } from './styles';

const AccountLogin: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const shouldShow = useMemo(() => {
		if (!userPreferences.isPRO) {
			return false;
		}
		if (auth().currentUser) {
			return false;
		}

		return true;
	}, [userPreferences.isPRO]);

	const handleNavigate = useCallback(() => {
		navigate('Login');
	}, [navigate]);

	return shouldShow ? (
		<Container onPress={handleNavigate}>
			<Icon name="person-circle-outline" />
			<TextContainer>
				<Text>Entre com sua conta</Text>
			</TextContainer>
		</Container>
	) : (
		<></>
	);
};

export default AccountLogin;
