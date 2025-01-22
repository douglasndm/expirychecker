import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@teams/Locales';

import Purchases from '@services/RevenueCat';

import Header from '@components/Header';
import Input from '@components/InputText';
import Button from '@components/Button';
import Container from '@components/ScrollView';

import Footer from '@teams/Views/Auth/Login/Footer';

import { Content } from '@teams/Views/Auth/Login/styles';
import {
	FormContainer,
	FormTitle,
	LoginForm,
	ForgotPasswordText,
} from '@teams/Views/Auth/Login/Form/styles';

const Login: React.FC = () => {
	const { pop, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [isLoging, setIsLoging] = useState<boolean>(false);

	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handlePasswordChange = useCallback(
		(value: string) => setPassword(value),
		[]
	);

	const handleLogin = useCallback(async () => {
		const schema = Yup.object().shape({
			email: Yup.string().required().email(),
			password: Yup.string().required(),
		});

		try {
			await schema.validate({ email, password });
		} catch (err) {
			showMessage({
				message: strings.View_Login_InputText_EmptyText,
				type: 'warning',
			});
			return;
		}

		try {
			setIsLoging(true);

			await auth().signInWithEmailAndPassword(email, password);

			await Purchases.logIn(email);
			await Purchases.setEmail(email);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoging(false);
		}
	}, [email, password]);

	// Handle user state changes
	const onAuthStateChanged = useCallback(
		(lUser: FirebaseAuthTypes.User | null) => {
			if (lUser) {
				pop();
			}
		},
		[pop]
	);

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

		return subscriber; // unsubscribe on unmount
	}, [onAuthStateChanged]);

	const handleNavigateToForgotPass = useCallback(() => {
		navigate('ForgotPassword');
	}, [navigate]);

	return (
		<Container>
			<Header title="Login" noDrawer />

			<Content>
				<FormContainer>
					<FormTitle>{strings.View_Login_FormLogin_Title}</FormTitle>
					<LoginForm>
						<Input
							value={email}
							onChangeText={handleEmailChange}
							placeholder={
								strings.View_Login_InputText_Email_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							contentStyle={{ marginBottom: 10 }}
						/>

						<Input
							value={password}
							onChangeText={handlePasswordChange}
							placeholder={
								strings.View_Login_InputText_Password_Placeholder
							}
							autoCorrect={false}
							autoCapitalize="none"
							isPassword
						/>

						<ForgotPasswordText
							onPress={handleNavigateToForgotPass}
						>
							{strings.View_Login_Label_ForgotPassword}
						</ForgotPasswordText>
					</LoginForm>

					<Button
						title={strings.View_Login_Button_SignIn}
						onPress={handleLogin}
						isLoading={isLoging}
					/>
				</FormContainer>
			</Content>

			<Footer />
		</Container>
	);
};

export default Login;
