import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from 'styled-components/native';
import { Button } from 'react-native-paper';

import InputText from '@components/InputText';
import strings from '~/Locales';

import Header from '@components/Header';

import {
	getCategory,
	updateCategory,
	deleteCategory,
} from '~/Functions/Category';

import {
	Container,
	Content,
	ActionsButtonContainer,
	ButtonPaper,
	InputTextContainer,
	InputTextTip,
	DialogPaper,
	Icons,
	Text,
} from './styles';

interface Props {
	id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();
	const theme = useTheme();

	const [name, setName] = useState<string>('');
	const [errorName, setErrorName] = useState<string>('');

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const routeParams = params as Props;

	const handleDeleteCategory = useCallback(async () => {
		try {
			await deleteCategory({ category_id: routeParams.id });

			showMessage({
				message: strings.View_Category_Success_OnDelete,
				type: 'info',
			});

			reset({
				routes: [
					{ name: 'Home' },
					{
						name: 'ListCategory',
					},
				],
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [reset, routeParams.id]);

	useEffect(() => {
		getCategory(routeParams.id).then(response => setName(response.name));
	}, [routeParams.id]);

	const onNameChange = useCallback(value => {
		setErrorName('');
		setName(value);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (!name) {
			setErrorName(strings.View_Category_Edit_ErrorEmtpyName);
			return;
		}

		await updateCategory({
			id: routeParams.id,
			name,
		});

		showMessage({
			message: strings.View_Category_Edit_SuccessText,
			type: 'info',
		});

		reset({
			routes: [
				{ name: 'Home' },
				{
					name: 'ListCategory',
				},
			],
		});
	}, [routeParams.id, name, reset]);

	return (
		<>
			<Container>
				<Header title={strings.View_Category_Edit_PageTitle} noDrawer />

				<Content>
					<InputTextContainer hasError={!!errorName}>
						<InputText
							placeholder={
								strings.View_Category_Edit_InputNamePlaceholder
							}
							value={name}
							onChange={onNameChange}
						/>
					</InputTextContainer>
					{!!errorName && <InputTextTip>{errorName}</InputTextTip>}

					<ActionsButtonContainer>
						<ButtonPaper
							icon={() => <Icons name="save-outline" size={22} />}
							onPress={handleUpdate}
						>
							{strings.View_Category_Edit_ButtonSave}
						</ButtonPaper>

						<ButtonPaper
							icon={() => (
								<Icons name="trash-outline" size={22} />
							)}
							onPress={() => {
								setDeleteComponentVisible(true);
							}}
						>
							{strings.View_ProductDetails_Button_DeleteProduct}
						</ButtonPaper>
					</ActionsButtonContainer>
				</Content>
			</Container>
			<DialogPaper
				visible={deleteComponentVisible}
				onDismiss={() => {
					setDeleteComponentVisible(false);
				}}
			>
				<DialogPaper.Title style={{ color: theme.colors.text }}>
					{strings.View_Category_Edit_DeleteModal_Title}
				</DialogPaper.Title>
				<DialogPaper.Content>
					<Text>
						{strings.View_Category_Edit_DeleteModal_Message}
					</Text>
				</DialogPaper.Content>
				<DialogPaper.Actions>
					<Button color="red" onPress={handleDeleteCategory}>
						{strings.View_Category_Edit_DeleteModal_Confirm}
					</Button>
					<Button
						color={theme.colors.text}
						onPress={() => {
							setDeleteComponentVisible(false);
						}}
					>
						{strings.View_Category_Edit_DeleteModal_Cancel}
					</Button>
				</DialogPaper.Actions>
			</DialogPaper>
		</>
	);
};

export default Edit;
