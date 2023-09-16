import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { exists } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';
import Crashlytics from '@react-native-firebase/crashlytics';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getLocalImageFromProduct } from '@utils/Product/Image/GetLocalImage';

import {
	getProductById,
	updateProduct,
	deleteProduct,
} from '@expirychecker/Functions/Product';
import {
	saveProductImage,
	getImageFileNameFromPath,
} from '@expirychecker/Functions/Products/Image';
import { movePicturesToImagesDir } from '@utils/Images/MoveToImagesDir';

import Input from '@components/InputText';
import Loading from '@components/Loading';
import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import Camera from '@components/Camera';
import Dialog from '@components/Dialog';

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
} from '@views/Product/Add/styles';

import {
	InputCodeText,
	InputTextIconContainer,
} from '../Add/Components/Inputs/Code/styles';

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
		try {
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

			if (product.photo || product.code) {
				let path: string | null = null;

				if (product.photo) {
					path = await getLocalImageFromProduct(product.photo);
				} else if (product.code) {
					path = await getLocalImageFromProduct(product.code);
				}

				if (path) {
					setPhotoPath(`${path}`);
				}
			}

			if (product.category) {
				setSelectedCategory(product.category.id);
			}

			if (product.store) {
				setSelectedStore(product.store.id);
			}

			if (product.brand) {
				setSelectedBrand(product.brand.id);
			}

			if (product.daysToBeNext) {
				setDaysNext(product.daysToBeNext);
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});

				if (__DEV__) {
					console.error(err);
				} else {
					Crashlytics().recordError(err);
				}
			}
		} finally {
			setIsLoading(false);
		}
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
				code: code.trim(),
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
		async (filePath: string) => {
			if (await exists(filePath)) {
				const picFileName = getImageFileNameFromPath(filePath);
				const newPath = await movePicturesToImagesDir(filePath);

				setPhotoPath(newPath);

				await saveProductImage({
					fileName: picFileName,
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

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return (
		<>
			{isCameraEnabled ? (
				<Camera
					onPhotoTaken={onPhotoTaked}
					switchEnableCamera={handleDisableCamera}
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
							<Header
								title={strings.View_EditProduct_PageTitle}
								noDrawer
								appBarActions={[
									{
										icon: 'content-save-outline',
										onPress: updateProd,
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

							{isLoading ? (
								<Loading />
							) : (
								<PageContent>
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
														setNameFieldError(
															false
														);
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
													justifyContent:
														'space-between',
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
														defaultValue={
															selectedBrand
														}
														onChange={
															setSelectedBrand
														}
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
									</InputContainer>
								</PageContent>
							)}

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
