import React, {
	useState,
	useContext,
	useCallback,
	useMemo,
	useRef,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { exists, unlink } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { createProduct } from '@expirychecker/Functions/Product';
import { createLote } from '@expirychecker/Functions/Lotes';
import { getImageFileNameFromPath } from '@expirychecker/Functions/Products/Image';

import Input from '@components/InputText';
import BarCodeReader from '@components/BarCodeReader';
import Header from '@components/Header';
import GenericButton from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import Camera, { onPhotoTakedProps } from '@expirychecker/Components/Camera';
import DaysToBeNext from '@expirychecker/Components/Product/Inputs/DaysToBeNext';
import BrandSelect, {
	IBrandPickerRef,
} from '@expirychecker/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '@expirychecker/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '@expirychecker/Components/Product/Inputs/Pickers/Store';

import {
	Container,
	PageContent,
	ProductImageContainer,
	ProductImage,
	InputContainer,
	InputTextContainer,
	InputTextTip,
	CameraButtonContainer,
	Currency,
	InputGroup,
	MoreInformationsContainer,
	MoreInformationsTitle,
	ExpDateGroup,
	ExpDateLabel,
	CustomDatePicker,
	ImageContainer,
	Icon,
} from '@views/Product/Add/styles';

import InputCode, {
	completeInfoProps,
	InputsRequestRef,
} from './Components/Inputs/Code';
import Interstitial, { IInterstitialRef } from './Components/Interstitial';

interface Request {
	route: {
		params: {
			brand?: string;
			category?: string;
			code?: string;
			store?: string;
		};
	};
}

const Add: React.FC<Request> = ({ route }: Request) => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const InterstitialRef = useRef<IInterstitialRef>();
	const BrandsPickerRef = useRef<IBrandPickerRef>();
	const BarCodeInputRef = useRef<InputsRequestRef>(null);

	const locale = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'en-US';
		}
		return 'pt-BR';
	}, []);
	const currency = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'USD';
		}

		return 'BRL';
	}, []);

	const { userPreferences } = useContext(PreferencesContext);

	const [name, setName] = useState('');
	const [photoPath, setPhotoPath] = useState('');
	const [lote, setLote] = useState('');
	const [amount, setAmount] = useState('');
	const [price, setPrice] = useState<number | null>(null);
	const [expDate, setExpDate] = useState(new Date());

	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		() => {
			if (route.params && route.params.category) {
				return route.params.category;
			}
			return null;
		}
	);
	const [code, setCode] = useState<string | undefined>(() => {
		if (route.params && route.params.code) {
			return route.params.code;
		}
		return '';
	});
	const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
		if (route.params && route.params.brand) {
			return route.params.brand;
		}
		return null;
	});
	const [selectedStore, setSelectedStore] = useState<string | null>(() => {
		if (route.params && route.params.store) {
			return route.params.store;
		}
		return null;
	});

	const [daysNext, setDaysNext] = useState<number | undefined>();
	const [nameFieldError, setNameFieldError] = useState<boolean>(false);
	const [existentProduct, setExistentProduct] = useState<boolean>(false);

	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

	const handleSave = useCallback(async () => {
		if (!name || name.trim() === '') {
			setNameFieldError(true);
			return;
		}

		if (nameFieldError || existentProduct) {
			return;
		}
		try {
			const picFileName = getImageFileNameFromPath(photoPath);

			const prodCategories: Array<string> = [];

			if (selectedCategory && selectedCategory !== 'null') {
				prodCategories.push(selectedCategory);
			}

			const tempBrand =
				selectedBrand && selectedBrand !== 'null'
					? selectedBrand
					: undefined;

			const tempStore =
				selectedStore && selectedStore !== 'null'
					? selectedStore
					: undefined;

			const newProduct: Omit<IProduct, 'id'> = {
				name,
				code,
				brand: tempBrand,
				store: tempStore,
				photo: picFileName,
				daysToBeNext: daysNext,
				categories: prodCategories,
				batches: [],
			};

			const newLote: Omit<IBatch, 'id'> = {
				name: lote,
				exp_date: expDate,
				amount: Number(amount),
				price: price || undefined,
				status: 'Não tratado',
			};

			const productCreatedId = await createProduct({
				product: newProduct,
			});

			if (productCreatedId) {
				await createLote({
					lote: newLote,
					productId: productCreatedId,
				});

				if (!userPreferences.disableAds) {
					if (InterstitialRef.current) {
						InterstitialRef.current.showInterstitial();
					}
				}

				if (userPreferences.isPRO) {
					navigate('ProductDetails', {
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
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [
		amount,
		code,
		daysNext,
		existentProduct,
		expDate,
		lote,
		name,
		nameFieldError,
		navigate,
		photoPath,
		price,
		selectedBrand,
		selectedCategory,
		selectedStore,
		userPreferences.disableAds,
		userPreferences.isPRO,
	]);

	const handleAmountChange = useCallback((value: string) => {
		const regex = /^[0-9\b]+$/;

		if (value === '' || regex.test(value)) {
			setAmount(value);
		}
	}, []);

	const handleEnableCamera = useCallback(async () => {
		if (!userPreferences.isPRO) {
			navigate('Pro');
			return;
		}

		if (photoPath) {
			if (await exists(photoPath)) {
				await unlink(photoPath);
				setPhotoPath('');
			}
		}
		setIsCameraEnabled(true);
	}, [photoPath, navigate, userPreferences.isPRO]);

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
		async ({ filePath }: onPhotoTakedProps) => {
			if (await exists(filePath)) {
				setPhotoPath(filePath);
			}

			handleDisableCamera();
		},
		[handleDisableCamera]
	);

	const handleNameChange = useCallback((value: string) => {
		setName(value);
		setNameFieldError(false);
	}, []);

	const handlePriceChange = useCallback((value: number) => {
		if (value <= 0) {
			setPrice(null);
			return;
		}
		setPrice(value);
	}, []);

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
				onPhotoTaked={onPhotoTaked}
				onBackButtonPressed={handleDisableCamera}
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

			<Header title={strings.View_AddProduct_PageTitle} noDrawer />
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
					<InputGroup>
						<InputTextContainer hasError={nameFieldError}>
							<Input
								placeholder={
									strings.View_AddProduct_InputPlacehoder_Name
								}
								value={name}
								onChange={handleNameChange}
							/>
						</InputTextContainer>

						<CameraButtonContainer onPress={handleEnableCamera}>
							<Icon name="camera-outline" size={36} />
						</CameraButtonContainer>
					</InputGroup>
					{nameFieldError && (
						<InputTextTip>
							{strings.View_AddProduct_AlertTypeProductName}
						</InputTextTip>
					)}

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
							<Input
								contentStyle={{
									flex: 5,
									marginRight: 10,
								}}
								placeholder={
									strings.View_AddProduct_InputPlacehoder_Batch
								}
								value={lote}
								onChange={value => setLote(value)}
							/>

							<Input
								contentStyle={{
									flex: 4,
								}}
								placeholder={
									strings.View_AddProduct_InputPlacehoder_Amount
								}
								keyboardType="numeric"
								value={String(amount)}
								onChange={handleAmountChange}
							/>
						</InputGroup>

						<Currency
							value={price}
							onChangeValue={handlePriceChange}
							delimiter={currency === 'BRL' ? ',' : '.'}
							placeholder={
								strings.View_AddProduct_InputPlacehoder_UnitPrice
							}
						/>

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
							</>
						)}

						{userPreferences.multiplesStores && (
							<StoreSelect
								defaultValue={selectedStore}
								onChange={setSelectedStore}
							/>
						)}
					</MoreInformationsContainer>

					<ExpDateGroup>
						<ExpDateLabel>
							{strings.View_AddProduct_CalendarTitle}
						</ExpDateLabel>

						<CustomDatePicker
							accessibilityLabel={
								strings.View_AddProduct_CalendarAccessibilityDescription
							}
							date={expDate}
							onDateChange={value => {
								setExpDate(value);
							}}
							locale={locale}
						/>
					</ExpDateGroup>
				</InputContainer>

				<GenericButton
					text={strings.View_AddProduct_Button_Save}
					onPress={handleSave}
				/>
				<PaddingComponent />
			</PageContent>
		</Container>
	);
};

export default Add;
