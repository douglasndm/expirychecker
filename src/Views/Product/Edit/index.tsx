import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { exists } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { captureException } from '@services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getLocalImageFromProduct } from '@utils/Product/Image/GetLocalImage';
import { getProductById } from '@expirychecker/Utils/Products/Product/Get';
import { deleteProduct } from '@expirychecker/Utils/Products/Product/Delete';

import { updateProduct } from '@expirychecker/Functions/Product';
import {
	saveProductImage,
	getImageFileNameFromPath,
} from '@expirychecker/Functions/Products/Image';
import { movePicturesToImagesDir } from '@utils/Images/MoveToImagesDir';

import Loading from '@components/Loading';
import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import Camera from '@components/Camera';
import Dialog from '@components/Dialog';
import PaddingComponent from '@components/PaddingComponent';
import { Input } from '@components/InputText/styles';

import DaysToBeNext from '@expirychecker/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '@expirychecker/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@expirychecker/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@expirychecker/Components/Product/Inputs/Pickers/Store';

import ProductName from '@views/Product/Add/Components/Inputs/ProductName';

import {
	Container,
	PageContent,
	InputGroup,
	InputContainer,
	InputTextContainer,
	InputCodeTextIcon,
	ImageContainer,
	ProductImage,
	ProductImageContainer,
	MoreInformationsContainer,
	MoreInformationsTitle,
} from '@views/Product/Add/styles';

import { InputTextIconContainer } from '../Add/Components/Inputs/Code/styles';

type ScreenProps = StackScreenProps<RoutesParams, 'EditProduct'>;

const Edit: React.FC<ScreenProps> = ({ route }) => {
	const { userPreferences } = useContext(PreferencesContext);

	const { productId } = route.params;

	const { navigate, dispatch } =
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
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error, showAlert: true });
			}
		} finally {
			setIsLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const updateProd = useCallback(async () => {
		if (name.trim() === '') {
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
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error, showAlert: true });
			}
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
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error, showAlert: true });
			}
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
										disabled: isLoading,
									},
								]}
								moreMenuItems={
									isLoading
										? []
										: [
												{
													title: strings.View_ProductDetails_Button_DeleteProduct,
													leadingIcon:
														'trash-can-outline',
													onPress:
														switchShowDeleteModal,
												},
										  ]
								}
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
										<ProductName
											name={name}
											setName={setName}
											handleEnableCamera={
												handleEnableCamera
											}
										/>

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
												<Input
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
													<StoreSelect
														defaultValue={
															selectedStore
														}
														onChange={
															setSelectedStore
														}
													/>
												</>
											)}
										</MoreInformationsContainer>
									</InputContainer>
									<PaddingComponent />
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
