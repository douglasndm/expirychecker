import React, { useState, useContext, useCallback, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { exists, unlink } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { captureException } from '@services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { movePicturesToImagesDir } from '@utils/Images/MoveToImagesDir';
import { handlePurchase } from '@expirychecker/Utils/Purchases/HandlePurchase';

import { createProduct } from '@expirychecker/Functions/Product';
import { getImageFileNameFromPath } from '@expirychecker/Functions/Products/Image';

import BarCodeReader from '@components/BarCodeReader';
import Camera from '@components/Camera';
import Header from '@components/Header';
import PaddingComponent from '@components/PaddingComponent';

import DaysToBeNext from '@expirychecker/Components/Product/Inputs/DaysToBeNext';
import BrandSelect, {
	IBrandPickerRef,
} from '@expirychecker/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@expirychecker/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@expirychecker/Components/Product/Inputs/Pickers/Store';

import ProductName from '@views/Product/Add/Components/Inputs/ProductName';
import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';
import {
	Container,
	PageContent,
	ProductImageContainer,
	ProductImage,
	InputContainer,
	InputGroup,
	MoreInformationsContainer,
	MoreInformationsTitle,
	ImageContainer,
} from '@views/Product/Add/styles';

import InputCode, {
	completeInfoProps,
	InputsRequestRef,
} from './Components/Inputs/Code';
import Interstitial, { IInterstitialRef } from './Components/Interstitial';

type ScreenProps = StackScreenProps<RoutesParams, 'AddProduct'>;

const Add: React.FC<ScreenProps> = ({ route }) => {
	const { navigate, replace } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { brand, category, store, code: routeCode } = route.params;

	const InterstitialRef = useRef<IInterstitialRef>();
	const BrandsPickerRef = useRef<IBrandPickerRef>(null);
	const BarCodeInputRef = useRef<InputsRequestRef>(null);

	const { userPreferences } = useContext(PreferencesContext);

	const [name, setName] = useState('');
	const [photoPath, setPhotoPath] = useState('');
	const [lote, setLote] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [price, setPrice] = useState<number | null>(null);
	const [expDate, setExpDate] = useState(new Date());

	const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
		return brand || null;
	});

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			return category || null;
		}
	);

	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		return store || null;
	});

	const [code, setCode] = useState<string | undefined>(() => {
		return routeCode || '';
	});

	const [daysNext, setDaysNext] = useState<number | undefined>();
	const [existentProduct, setExistentProduct] = useState<boolean>(false);

	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

	const handleSave = useCallback(async () => {
		if (name.trim() === '') {
			return;
		}

		if (existentProduct) {
			return;
		}
		try {
			let picFileName: string | undefined;

			if (photoPath) {
				picFileName = getImageFileNameFromPath(photoPath);

				await movePicturesToImagesDir(photoPath);
			}

			const newLote: Omit<IBatch, 'id'> = {
				name: lote,
				exp_date: expDate,
				amount: Number(amount),
				price: price || undefined,
				status: 'Não tratado',
			};
			const newProduct: Omit<IProduct, 'id'> = {
				name,
				code: code?.trim(),
				brand: selectedBrand === 'null' ? undefined : selectedBrand,
				category:
					selectedCategory === 'null' ? undefined : selectedCategory,
				store: selectedStore === 'null' ? undefined : selectedStore,
				photo: picFileName,
				daysToBeNext: daysNext,
				batches: [newLote],
			};

			const productCreatedId = await createProduct({
				product: newProduct,
			});

			if (productCreatedId) {
				if (!userPreferences.disableAds) {
					if (InterstitialRef.current) {
						InterstitialRef.current.showInterstitial();
					}
				}

				if (userPreferences.isPRO) {
					replace('ProductDetails', {
						id: productCreatedId,
					});

					showMessage({
						message: strings.View_Success_ProductCreatedDescription,
						type: 'info',
					});
				} else {
					navigate('Success', {
						type: 'create_product',
						productId: productCreatedId,

						category_id: selectedCategory || undefined,
						store_id: selectedStore || undefined,
					});
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error, showAlert: true });
			}
		}
	}, [
		amount,
		code,
		daysNext,
		existentProduct,
		expDate,
		lote,
		name,
		navigate,
		photoPath,
		price,
		replace,
		selectedBrand,
		selectedCategory,
		selectedStore,
		userPreferences.disableAds,
		userPreferences.isPRO,
	]);

	const handleEnableCamera = useCallback(async () => {
		if (!userPreferences.isPRO) {
			await handlePurchase();
			return;
		}

		if (photoPath) {
			if (await exists(photoPath)) {
				await unlink(photoPath);
				setPhotoPath('');
			}
		}
		setIsCameraEnabled(true);
	}, [photoPath, userPreferences.isPRO]);

	const handleSwitchEnableBarCode = useCallback(() => {
		const tmp = isBarCodeEnabled;
		setIsBarCodeEnabled(!tmp);
	}, [isBarCodeEnabled]);

	const handleDisableCamera = useCallback(() => {
		setIsCameraEnabled(false);
	}, []);

	const handleDuplicate = useCallback(() => {
		setExistentProduct(true);
	}, []);

	const onPhotoTaked = useCallback(
		async (filePath: string) => {
			if (await exists(filePath)) {
				setPhotoPath(filePath);
			}

			handleDisableCamera();
		},
		[handleDisableCamera]
	);

	const onCompleteInfo = useCallback(
		({ prodName, prodBrand }: completeInfoProps) => {
			setName(prodName);

			if (prodBrand) {
				// to do
			}
		},
		[]
	);

	const handleOnCodeRead = async (codeRead: string) => {
		setCode(codeRead);
		setIsBarCodeEnabled(false);

		if (BarCodeInputRef.current) {
			await BarCodeInputRef?.current.handleOnCodeRead(codeRead);
		}
	};

	if (isCameraEnabled) {
		return (
			<Camera
				onPhotoTaken={onPhotoTaked}
				switchEnableCamera={handleDisableCamera}
			/>
		);
	}

	return (
		<Container>
			{isBarCodeEnabled && (
				<BarCodeReader
					onClose={handleSwitchEnableBarCode}
					onCodeRead={handleOnCodeRead}
				/>
			)}
			<Interstitial ref={InterstitialRef} />

			<Header
				title={strings.View_AddProduct_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleSave,
					},
				]}
			/>
			<PageContent>
				{userPreferences.isPRO && !!photoPath && (
					<ImageContainer>
						<ProductImageContainer onPress={handleEnableCamera}>
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
						handleEnableCamera={handleEnableCamera}
					/>

					<InputCode
						ref={BarCodeInputRef}
						code={code}
						setCode={setCode}
						onDuplicateProduct={handleDuplicate}
						onCompleteInfo={onCompleteInfo}
						BrandsPickerRef={BrandsPickerRef}
						selectedStoreId={selectedStore || undefined}
						onSwitchEnable={handleSwitchEnableBarCode}
					/>

					<MoreInformationsContainer>
						<MoreInformationsTitle>
							{strings.View_AddProduct_MoreInformation_Label}
						</MoreInformationsTitle>

						<InputGroup>
							<ProductBatch batch={lote} setBatch={setLote} />

							<ProductCount
								amount={amount}
								setAmount={setAmount}
							/>
						</InputGroup>

						<BatchPrice price={price} setPrice={setPrice} />

						{userPreferences.isPRO && (
							<>
								<DaysToBeNext onChange={setDaysNext} />

								<CategorySelect
									onChange={setSelectedCategory}
									defaultValue={selectedCategory}
									containerStyle={{
										marginBottom: 10,
									}}
								/>

								<BrandSelect
									ref={BrandsPickerRef}
									onChange={setSelectedBrand}
									defaultValue={selectedBrand}
									containerStyle={{
										marginBottom: 10,
									}}
								/>

								<StoreSelect
									defaultValue={selectedStore}
									onChange={setSelectedStore}
								/>
							</>
						)}
					</MoreInformationsContainer>

					<BatchExpDate expDate={expDate} setExpDate={setExpDate} />
				</InputContainer>

				<PaddingComponent />
			</PageContent>
		</Container>
	);
};

export default Add;
