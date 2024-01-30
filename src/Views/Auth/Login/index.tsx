import React, { useState, useEffect, useCallback } from 'react';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
	GoogleOneTapSignIn,
	statusCodes,
	type OneTapUser,
} from '@react-native-google-signin/google-signin';

import Header from '@components/Header';

import {
	Container,
	Content,
	LoginText,
	ButtonsContainer,
	AppleButton,
	GoogleButton,
} from './styles';

const Login: React.FC = () => {
	// Set an initializing state whilst Firebase connects
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();
	// Handle user state changes
	function onAuthStateChanged(lUser) {
		setUser(lUser);
		if (initializing) setInitializing(false);
		// console.log(lUser);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber; // unsubscribe on unmount
	}, []);

	const onAppleButtonPress = useCallback(async () => {
		// Start the sign-in request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			// As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
			// See: https://github.com/invertase/react-native-apple-authentication#faqs
			requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
		});

		// Ensure Apple returned a user identityToken
		if (!appleAuthRequestResponse.identityToken) {
			throw new Error(
				'Apple Sign-In failed - no identify token returned'
			);
		}

		// Create a Firebase credential from the response
		const { identityToken, nonce } = appleAuthRequestResponse;
		const appleCredential = auth.AppleAuthProvider.credential(
			identityToken,
			nonce
		);

		// Sign the user in with the credential
		return auth().signInWithCredential(appleCredential);
	}, []);

	const onGoogleButtonPress = useCallback(async () => {}, []);

	return (
		<Container>
			<Header title="Login" noDrawer />

			<Content>
				{user ? (
					<LoginText>You are signed in</LoginText>
				) : (
					<ButtonsContainer>
						<AppleButton onPress={onAppleButtonPress} />
						<GoogleButton onPress={onGoogleButtonPress} />
					</ButtonsContainer>
				)}
			</Content>
		</Container>
	);
};

export default Login;
