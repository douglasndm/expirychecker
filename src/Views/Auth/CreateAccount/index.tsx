import React, { useCallback, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import * as Yup from 'yup';

import strings from '@shared/Locales';

import Header from '@components/Header';
import Input from '@components/InputText';
import Button from '@components/Button';

import { FormContainer } from '@views/Auth/Login/Form/styles';
import { Container, PageContent } from '@views/Auth/CreateAccount/styles';

const CreateAccount: React.FC = () => {
	const { pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [name, setName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [isCreating, setIsCreating] = useState<boolean>(false);

	const handleNameChange = useCallback(
		(value: string) => setName(value.trim()),
		[]
	);
	const handleLastNameChange = useCallback(
		(value: string) => setLastName(value.trim()),
		[]
	);
	const handleEmailChange = useCallback(
		(value: string) => setEmail(value.trim()),
		[]
	);

	const handlePasswordChange = useCallback(
		(value: string) => setPassword(value),
		[]
	);

	const handlePasswordConfirmChange = useCallback(
		(value: string) => setPasswordConfirm(value),
		[]
	);

	const handleCreateAccount = useCallback(async () => {
		const schema = Yup.object().shape({
			name: Yup.string().required(
				strings.View_CreateAccount_Alert_Error_EmptyName
			),
			lastName: Yup.string().required(
				strings.View_CreateAccount_Alert_Error_EmptyLastName
			),
			email: Yup.string()
				.required(strings.View_CreateAccount_Alert_Error_EmptyEmail)
				.email(strings.View_CreateAccount_Alert_Error_InvalidEmail),
			password: Yup.string()
				.required(strings.View_CreateAccount_Alert_Error_EmptyPassword)
				.min(6),
			passwordConfirm: Yup.string().oneOf(
				[Yup.ref('password'), undefined],
				strings.View_CreateAccount_Alert_Error_InvalidPassConfirm
			),
		});

		try {
			await schema.validate(
				{
					name,
					lastName,
					email,
					password,
					passwordConfirm,
				},
				{ abortEarly: false }
			);
		} catch (err) {
			if (err instanceof Yup.ValidationError) {
				showMessage({
					message: err.errors[0],
					type: 'warning',
				});
			}
			return;
		}

		try {
			setIsCreating(true);

			const { user } = await auth().createUserWithEmailAndPassword(
				email,
				password
			);

			await user.sendEmailVerification();

			await user.updateProfile({
				displayName: `${name} ${lastName}`,
			});

			await auth().signInWithEmailAndPassword(email, password);

			showMessage({
				message: strings.View_CreateAccount_Alert_Success_Title,
				description: strings.View_CreateAccount_Alert_Success_Message,
				type: 'info',
			});

			pop(2);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'warning',
				});
		} finally {
			setIsCreating(false);
		}
	}, [email, lastName, name, password, passwordConfirm, pop]);

	return (
		<Container>
			<Header title={strings.View_CreateAccount_PageTitle} noDrawer />
			<PageContent>
				<FormContainer>
					<Input
						placeholder={
							strings.View_CreateAccount_Input_Name_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="words"
						value={name}
						onChangeText={handleNameChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_LastName_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="words"
						value={lastName}
						onChangeText={handleLastNameChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_Email_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						value={email}
						onChangeText={handleEmailChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_Password_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						isPassword
						value={password}
						onChangeText={handlePasswordChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Input
						placeholder={
							strings.View_CreateAccount_Input_ConfirmPassword_Placeholder
						}
						autoCorrect={false}
						autoCapitalize="none"
						isPassword
						value={passwordConfirm}
						onChangeText={handlePasswordConfirmChange}
						contentStyle={{ marginBottom: 7 }}
					/>

					<Button
						title={strings.View_CreateAccount_Button_CreateAccount}
						onPress={handleCreateAccount}
						isLoading={isCreating}
					/>
				</FormContainer>
			</PageContent>
		</Container>
	);
};

export default CreateAccount;
