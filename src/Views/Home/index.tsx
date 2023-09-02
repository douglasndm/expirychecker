import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from 'react';
import { Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import Crashlytics from '@react-native-firebase/crashlytics';
import remoteConfig from '@react-native-firebase/remote-config';
import { showMessage } from 'react-native-flash-message';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';
import {
	BannerAdSize,
	AdsConsent,
	AdsConsentStatus,
	AdsConsentDebugGeography,
} from 'react-native-google-mobile-ads';

import strings from '@expirychecker/Locales';

import { searchProducts } from '@utils/Product/Search';

import Loading from '@components/Loading';
import BarCodeReader from '@components/BarCodeReader';
import DatePicker from '@components/DatePicker';
import NotificationsDenny from '@components/NotificationsDenny';
import OutdateApp from '@components/OutdateApp';
import FAB from '@components/FAB';

import {
	Container,
	InputSearch,
	InputTextContainer,
	InputTextIcon,
	InputTextIconContainer,
	ActionButtonsContainer,
} from '@views/Home/styles';

import Header from '@expirychecker/Components/Header';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getAllowedToReadIDFA } from '@expirychecker/Functions/Privacy';
import { sortProductsLotesByLotesExpDate } from '@expirychecker/Functions/Products';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';

import ListProducts from '@expirychecker/Components/ListProducts';
import Banner from '@expirychecker/Components/Ads/Banner';
import ExpiredModal from '@expirychecker/Components/Subscription/ExpiredModal';

const Home: React.FC = () => {
	const { reset, canGoBack, navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const listRef = useRef<FlatList<IProduct>>(null);

	const enableTabBar = remoteConfig().getValue('enable_app_bar');

	const enableFloatAddButton = useMemo(() => {
		if (!userPreferences.isPRO) {
			return true;
		}

		if (userPreferences.isPRO && enableTabBar.asBoolean() === false) {
			return true;
		}

		return false;
	}, [enableTabBar, userPreferences.isPRO]);

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isFABExtended, setIsFABExtended] = React.useState(true);

	const [products, setProducts] = useState<Array<IProduct>>([]);
	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

	const [searchString, setSearchString] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [enableBarCodeReader, setEnableBarCodeReader] =
		useState<boolean>(false);
	const [enableDatePicker, setEnableDatePicker] = useState(false);

	useEffect(() => {
		if (Platform.OS === 'ios') {
			getAllowedToReadIDFA().then(response => {
				if (response === null) {
					reset({
						routes: [{ name: 'TrackingPermission' }],
					});
				}
			});
		}
	}, [reset]);

	const adConsent = useCallback(async () => {
		const consentInfo = await AdsConsent.requestInfoUpdate({
			// debugGeography: AdsConsentDebugGeography.EEA,
		});

		if (
			consentInfo.isConsentFormAvailable &&
			consentInfo.status === AdsConsentStatus.REQUIRED
		) {
			const { status } = await AdsConsent.showForm();
		}
	}, []);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const allProducts = await getAllProductsAsync({
				removeProductsWithoutBatches: true,
				removeTreatedBatch: true,
				sortProductsByExpDate: true,
			});

			setProducts(allProducts);
		} catch (err) {
			if (err instanceof Error) {
				Crashlytics().recordError(err);

				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsLoading(false);
			await BootSplash.hide({ fade: true });
		}
	}, []);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchString(search);

			if (search.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(() => {
		let prods: IProduct[] = [];

		if (searchString && searchString !== '') {
			prods = searchProducts({
				products,
				query: searchString,
			});
		}

		prods = sortProductsLotesByLotesExpDate(prods);

		setProductsSearch(prods);
	}, [products, searchString]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleOnBarCodeReaderOpen = useCallback(() => {
		setEnableBarCodeReader(true);
	}, []);

	const handleOnBarCodeReaderClose = useCallback(() => {
		setEnableBarCodeReader(false);
	}, []);

	const enableCalendarModal = useCallback(() => {
		setEnableDatePicker(true);
	}, []);

	const cleanSearch = useCallback(() => {
		setProductsSearch([]);
		setSearchString('');
	}, []);

	const handleSelectDateChange = useCallback(
		(date: Date) => {
			cleanSearch();

			setEnableDatePicker(false);

			let dateFormat = 'dd/MM/yyyy';
			if (getLocales()[0].languageCode === 'en') {
				dateFormat = 'MM/dd/yyyy';
			}
			const d = format(date, dateFormat);

			setSearchString(d);
			setSelectedDate(date);

			let prods: IProduct[] = [];
			if (d && d !== '') {
				prods = searchProducts({
					products,
					query: d,
				});
			}

			prods = sortProductsLotesByLotesExpDate(prods);

			setProductsSearch(prods);
		},
		[cleanSearch, products]
	);

	const handleOnCodeRead = useCallback(
		(code: string) => {
			setSearchString(code);
			setEnableBarCodeReader(false);

			let prods: IProduct[] = [];

			if (code && code !== '') {
				prods = searchProducts({
					products,
					query: code,
				});
			}

			prods = sortProductsLotesByLotesExpDate(prods);

			setProductsSearch(prods);
		},
		[products]
	);

	useEffect(() => {
		if (
			userPreferences.isPRO &&
			userPreferences.multiplesStores &&
			userPreferences.storesFirstPage
		) {
			if (!canGoBack()) {
				reset({
					routes: [{ name: 'StoreList' }],
				});
			}
		}
	}, [
		canGoBack,
		reset,
		userPreferences.isPRO,
		userPreferences.multiplesStores,
		userPreferences.storesFirstPage,
	]);

	const handleNavigateAddProduct = useCallback(() => {
		if (searchString && searchString !== '') {
			const queryWithoutLetters = searchString.replace(/\D/g, '').trim();
			const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

			navigate('AddProduct', {
				code: query,
			});
		} else {
			navigate('AddProduct', {});
		}
	}, [navigate, searchString]);

	const onScroll = ({ nativeEvent }) => {
		const currentScrollPosition =
			Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

		setIsFABExtended(currentScrollPosition <= 0);
	};

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<ExpiredModal />
			{enableBarCodeReader ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleOnBarCodeReaderClose}
				/>
			) : (
				<>
					<Header listRef={listRef} />

					<NotificationsDenny />

					<OutdateApp />

					{!userPreferences.isPRO && (
						<Banner adFor="Home" size={BannerAdSize.LARGE_BANNER} />
					)}

					{products.length > 0 && (
						<InputTextContainer>
							<InputSearch
								placeholder={strings.View_Home_SearchText}
								value={searchString}
								onChangeText={handleSearchChange}
								onSubmitEditing={handleSearch}
							/>

							<ActionButtonsContainer>
								<InputTextIconContainer
									onPress={handleOnBarCodeReaderOpen}
								>
									<InputTextIcon name="barcode-outline" />
								</InputTextIconContainer>

								{userPreferences.isPRO && (
									<InputTextIconContainer
										onPress={enableCalendarModal}
										style={{ marginLeft: 5 }}
									>
										<InputTextIcon name="calendar-outline" />
									</InputTextIconContainer>
								)}
							</ActionButtonsContainer>
						</InputTextContainer>
					)}

					<DatePicker
						isOpen={enableDatePicker}
						date={selectedDate}
						onConfirm={handleSelectDateChange}
						onCancel={() => {
							setEnableDatePicker(false);
						}}
					/>

					<ListProducts
						products={productsSearch}
						isHome
						onRefresh={loadData}
						isRefreshing={isLoading}
						listRef={listRef}
						onScroll={onScroll}
					/>

					{enableFloatAddButton && (
						<FAB
							icon="plus"
							isFABExtended={isFABExtended}
							label={strings.View_FloatMenu_AddProduct}
							onPress={handleNavigateAddProduct}
						/>
					)}
				</>
			)}
		</Container>
	);
};

export default Home;
