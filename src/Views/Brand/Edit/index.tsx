import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';
import {
	deleteBrand,
	getBrand,
	updateBrand,
} from '@expirychecker/Utils/Brands';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Dialog from '@components/Dialog';

import {
	Container,
	Content,
	InputTextContainer,
	InputText,
	InputTextTip,
} from '@views/Brand/Edit/styles';

interface Props {
	brand_id: string;
}
const Edit: React.FC = () => {
	const { params } = useRoute();
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [name, setName] = useState<string | undefined>(undefined);
	const [errorName, setErrorName] = useState<string>('');

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const routeParams = params as Props;

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const brand = await getBrand(routeParams.brand_id);

			setName(brand.name);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.brand_id]);

	useEffect(() => {
		loadData();
	}, []);

	const onNameChange = useCallback((value: string) => {
		setErrorName('');
		setName(value);
	}, []);

	const handleUpdate = useCallback(async () => {
		if (!name) {
			setErrorName('Digite o nome da marca');
			return;
		}

		await updateBrand({
			id: routeParams.brand_id,
			name,
		});

		showMessage({
			message: strings.View_Brand_Edit_SuccessText,
			type: 'info',
		});

		reset({
			routes: [
				{ name: 'Home' },
				{
					name: 'BrandList',
				},
			],
		});
	}, [name, routeParams.brand_id, reset]);

	const handleDeleteBrand = useCallback(async () => {
		try {
			await deleteBrand({
				brand_id: routeParams.brand_id,
			});

			showMessage({
				message: strings.View_Brand_Success_OnDelete,
				type: 'info',
			});

			reset({
				routes: [
					{ name: 'Home' },
					{
						name: 'BrandList',
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
	}, [reset, routeParams.brand_id]);

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_Brand_Edit_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleUpdate,
					},
				]}
				moreMenuItems={[
					{
						title: strings.View_ProductDetails_Button_DeleteProduct,
						leadingIcon: 'trash-can-outline',
						onPress: switchShowDeleteModal,
					},
				]}
			/>

			<Content>
				<InputTextContainer hasError={!!errorName}>
					<InputText
						placeholder={
							strings.View_Brand_Edit_InputNamePlaceholder
						}
						value={name}
						onChangeText={onNameChange}
					/>
				</InputTextContainer>
				{!!errorName && <InputTextTip>{errorName}</InputTextTip>}
			</Content>
			<Dialog
				visible={deleteComponentVisible}
				onDismiss={() => setDeleteComponentVisible(false)}
				onConfirm={handleDeleteBrand}
				title={strings.View_Brand_Edit_DeleteModal_Title}
				description={strings.View_Brand_Edit_DeleteModal_Message}
				confirmText={strings.View_Brand_Edit_DeleteModal_Confirm}
				cancelText={strings.View_Brand_Edit_DeleteModal_Cancel}
			/>
		</Container>
	);
};

export default Edit;
