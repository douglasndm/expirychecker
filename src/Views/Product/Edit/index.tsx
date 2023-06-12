import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { exists } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	getProductById,
	updateProduct,
	deleteProduct,
} from '@expirychecker/Functions/Product';
import { getStore } from '@expirychecker/Functions/Stores';
import {
	saveProductImage,
	getProductImagePath,
	getImageFileNameFromPath,
} from '@expirychecker/Functions/Products/Image';

import Input from '@components/InputText';
import Loading from '@components/Loading';
import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import ActionButton from '@components/ActionButton';
import Dialog from '@components/Dialog';

import Camera, { onPhotoTakedProps } from '@expirychecker/Components/Camera';

import DaysToBeNext from '@expirychecker/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '@expirychecker/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@expirychecker/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@expirychecker/Components/Product/Inputs/Pickers/Store';

import {
	Container,
	PageContent,
	InputGroup,
	InputContainer,
	InputTextContainer,
	InputTextTip,
	InputCodeTextIcon,
	ImageContainer,
	ProductImage,
	CameraButtonContainer,
	Icon,
	ProductImageContainer,
	MoreInformationsContainer,
	MoreInformationsTitle,
} from '../Add/styles';

import {
	InputCodeText,
	InputTextIconContainer,
} from '../Add/Components/Inputs/Code/styles';

import { ActionsButtonContainer } from './styles';

interface RequestParams {
	route: {
		params: {
			productId: number;
		};
	};
}

const Edit: React.FC<RequestParams> = ({ route }: RequestParams) => {
	const { userPreferences } = useContext(PreferencesContext);

	const { productId } = route.params;

	const { navigate, addListener, dispatch } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [photoPath, setPhotoPath] = useState<string>('');

	const [daysNext, setDaysNext] = useState<number | undefined>();

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null
	);
	const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
	const [selectedStore, setSelectedStore] = useState<string | null>(null);

	const [nameFieldError, setNameFieldError] = useState<boolean>(false);

	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

	const loadData = useCallback(async () => {
		setIsLoading(true);

		const product = await getProductById(productId);

		if (!product) {
			showMessage({
				message: strings.View_EditProduct_Error_ProductNotFound,
				type: 'danger',
			});
			return;
		}

		setName(product.name);
		if (product.code) setCode(product.code);

		const path = await getProductImagePath(productId);
		if (path) {
			setPhotoPath(`${path}`);
		}

		if (product.categories.length > 0) {
			setSelectedCategory(product.categories[0]);
		}

		if (product.store) {
			const store = await getStore(product.store);

			if (store) {
				setSelectedStore(store?.id);
			}
		}

		if (product.brand) {
			setSelectedBrand(product.brand);
		}

		if (product.daysToBeNext) {
			setDaysNext(product.daysToBeNext);
		}

		setIsLoading(false);
	}, [productId]);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	const updateProd = useCallback(async () => {
		if (!name || name.trim() === '') {
			setNameFieldError(true);
			return;
		}

		try {
			const photoFileName = getImageFileNameFromPath(photoPath);

			const prodCategories: Array<string> = [];

			if (selectedCategory && selectedCategory !== 'null') {
				prodCategories.push(selectedCategory);
			}

			const tempBrand =
				selectedBrand && selectedBrand !== 'null'
					? selectedBrand
					: null;

			const tempStore =
				selectedStore && selectedStore !== 'null'
					? selectedStore
					: null;

			updateProduct({
				id: productId,
				name,
				code,
				brand: tempBrand,
				store: tempStore,
				daysToBeNext: daysNext,

				categories: prodCategories,
				photo: photoFileName,
			});

			if (userPreferences.isPRO) {
				navigate('ProductDetails', {
					id: productId,
				});

				showMessage({
					message: strings.View_Success_ProductUpdatedDescription,
					type: 'info',
				});
			} else {
				navigate('Success', {
					productId,
					type: 'edit_product',
				});
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [
		code,
		daysNext,
		name,
		navigate,
		photoPath,
		productId,
		selectedBrand,
		selectedCategory,
		selectedStore,
		userPreferences.isPRO,
	]);

	const handleOnCodeRead = useCallback((codeRead: string) => {
		setCode(codeRead);
		setIsBarCodeEnabled(false);
	}, []);

	const handleEnableCamera = useCallback(() => {
		setIsBarCodeEnabled(false);
		setIsCameraEnabled(true);
	}, []);

	const handleDisableCamera = useCallback(() => {
		setIsCameraEnabled(false);
	}, []);

	const handleEnableBarCodeReader = useCallback(() => {
		setIsCameraEnabled(false);
		setIsBarCodeEnabled(true);
	}, []);

	const handleDisableBarCodeReader = useCallback(() => {
		setIsBarCodeEnabled(false);
	}, []);

	const onPhotoTaked = useCallback(
		async ({ fileName, filePath }: onPhotoTakedProps) => {
			if (await exists(filePath)) {
				setPhotoPath(filePath);

				await saveProductImage({
					fileName,
					productId,
				});
			}
			handleDisableCamera();
		},
		[handleDisableCamera, productId]
	);

	const handleDeleteProduct = useCallback(async () => {
		try {
			await deleteProduct(productId);

			if (userPreferences.isPRO) {
				const popAction = StackActions.pop(3);
				dispatch(popAction);

				showMessage({
					message: strings.View_Success_ProductDeletedDescription,
					type: 'info',
				});
			} else {
				navigate('Success', {
					type: 'delete_product',
				});
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [dispatch, navigate, productId, userPreferences.isPRO]);

	return isLoading ? (
		<Loading />
	) : (
		<>
			{isCameraEnabled ? (
				<Camera
					onPhotoTaked={onPhotoTaked}
					onBackButtonPressed={handleDisableCamera}
				/>
			) : (
				<>
					{isBarCodeEnabled ? (
						<BarCodeReader
							onCodeRead={handleOnCodeRead}
							onClose={handleDisableBarCodeReader}
						/>
					) : (
						<Container>
							<PageContent>
								<Header
									title={strings.View_EditProduct_PageTitle}
									noDrawer
								/>

								{userPreferences.isPRO && !!photoPath && (
									<ImageContainer>
										<ProductImageContainer
											onPress={handleEnableCamera}
										>
											<ProductImage
												source={{
													uri: `file://${photoPath}`,
												}}
											/>
										</ProductImageContainer>
									</ImageContainer>
								)}
								<InputContainer>
									<InputGroup>
										<InputTextContainer>
											<Input
												placeholder={
													strings.View_EditProduct_InputPlacehoder_Name
												}
												value={name}
												onChange={value => {
													setName(value);
													setNameFieldError(false);
												}}
											/>
										</InputTextContainer>

										{userPreferences.isPRO && (
											<CameraButtonContainer
												onPress={handleEnableCamera}
											>
												<Icon
													name="camera-outline"
													size={36}
												/>
											</CameraButtonContainer>
										)}
									</InputGroup>
									{nameFieldError && (
										<InputTextTip>
											{
												strings.View_EditProduct_Error_EmptyProductName
											}
										</InputTextTip>
									)}

									<InputGroup>
										<InputTextContainer
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												alignItems: 'center',
												paddingRight: 10,
											}}
										>
											<InputCodeText
												placeholder={
													strings.View_EditProduct_InputPlacehoder_Code
												}
												value={code}
												onChangeText={(
													value: string
												) => {
													setCode(value);
												}}
											/>

											<InputTextIconContainer
												onPress={
													handleEnableBarCodeReader
												}
											>
												<InputCodeTextIcon />
											</InputTextIconContainer>
										</InputTextContainer>
									</InputGroup>

									<MoreInformationsContainer>
										{userPreferences.isPRO && (
											<>
												<MoreInformationsTitle>
													{
														strings.View_EditProduct_MoreInformation_Label
													}
												</MoreInformationsTitle>

												<DaysToBeNext
													onChange={setDaysNext}
												/>

												<CategorySelect
													defaultValue={
														selectedCategory
													}
													onChange={
														setSelectedCategory
													}
													containerStyle={{
														marginBottom: 10,
													}}
												/>

												<BrandSelect
													defaultValue={selectedBrand}
													onChange={setSelectedBrand}
													containerStyle={{
														marginBottom: 10,
													}}
												/>
											</>
										)}

										{userPreferences.multiplesStores && (
											<StoreSelect
												defaultValue={selectedStore}
												onChange={setSelectedStore}
											/>
										)}
									</MoreInformationsContainer>

									<ActionsButtonContainer>
										<ActionButton
											text={
												strings.View_EditProduct_Button_Save
											}
											iconName="save-outline"
											onPress={updateProd}
										/>
										<ActionButton
											text={
												strings.View_ProductDetails_Button_DeleteProduct
											}
											iconName="trash-outline"
											onPress={() => {
												setDeleteComponentVisible(true);
											}}
										/>
									</ActionsButtonContainer>
								</InputContainer>
							</PageContent>

							<Dialog
								visible={deleteComponentVisible}
								onDismiss={() =>
									setDeleteComponentVisible(false)
								}
								onConfirm={handleDeleteProduct}
								title={
									strings.View_ProductDetails_WarningDelete_Title
								}
								description={
									strings.View_ProductDetails_WarningDelete_Message
								}
								confirmText={
									strings.View_ProductDetails_WarningDelete_Button_Confirm
								}
								cancelText={
									strings.View_ProductDetails_WarningDelete_Button_Cancel
								}
							/>
						</Container>
					)}
				</>
			)}
		</>
	);
};

export default Edit;
