import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import {
	getCategory,
	updateCategory,
	deleteCategory,
} from '@expirychecker/Functions/Category';

import Loading from '@components/Loading';
import Header from '@components/Header';
import InputText from '@components/InputText';
import Dialog from '@components/Dialog';

import {
	Container,
	Content,
	InputTextContainer,
	InputTextTip,
} from '@views/Category/Edit/styles';

interface Props {
	id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset, pop } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [name, setName] = useState<string>('');
	const [errorName, setErrorName] = useState<string>('');

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const routeParams = params as Props;

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const category = await getCategory(routeParams.id);

			setName(category.name);
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.id]);

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
		loadData();
	}, [loadData]);

	const onNameChange = useCallback((value: string) => {
		setErrorName('');
		setName(value);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (!name) {
			setErrorName(strings.View_Category_Edit_ErrorEmtpyName);
			return;
		}

		try {
			setIsLoading(true);

			await updateCategory({
				_id: routeParams.id,
				id: routeParams.id,
				name,
			});

			showMessage({
				message: strings.View_Category_Edit_SuccessText,
				type: 'info',
			});

			pop();
		} finally {
			setIsLoading(false);
		}
	}, [name, routeParams.id, pop]);

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_Category_Edit_PageTitle}
				noDrawer
				appBarActions={
					isLoading
						? []
						: [
								{
									icon: 'content-save-outline',
									onPress: handleUpdate,
								},
						  ]
				}
				moreMenuItems={
					isLoading
						? []
						: [
								{
									title: strings.View_ProductDetails_Button_DeleteProduct,
									leadingIcon: 'trash-can-outline',
									onPress: switchShowDeleteModal,
								},
						  ]
				}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<>
					<Content>
						<InputTextContainer hasError={!!errorName}>
							<InputText
								placeholder={
									strings.View_Category_Edit_InputNamePlaceholder
								}
								value={name}
								onChangeText={onNameChange}
							/>
						</InputTextContainer>
						{!!errorName && (
							<InputTextTip>{errorName}</InputTextTip>
						)}
					</Content>
					<Dialog
						visible={deleteComponentVisible}
						onDismiss={() => setDeleteComponentVisible(false)}
						onConfirm={handleDeleteCategory}
						title={strings.View_Category_Edit_DeleteModal_Title}
						description={
							strings.View_Category_Edit_DeleteModal_Message
						}
						confirmText={
							strings.View_Category_Edit_DeleteModal_Confirm
						}
						cancelText={
							strings.View_Category_Edit_DeleteModal_Cancel
						}
					/>
				</>
			)}
		</Container>
	);
};

export default Edit;
