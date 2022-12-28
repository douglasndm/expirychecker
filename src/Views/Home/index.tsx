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
import remoteConfig from '@react-native-firebase/remote-config';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '@expirychecker/Locales';

import { searchProducts } from '@utils/Product/Search';

import Loading from '@components/Loading';
import BarCodeReader from '@components/BarCodeReader';
import NotificationsDenny from '@components/NotificationsDenny';
import OutdateApp from '@components/OutdateApp';

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
import {
	sortProductsLotesByLotesExpDate,
	getAllProducts,
} from '@expirychecker/Functions/Products';

import ListProducts from '@expirychecker/Components/ListProducts';
import Banner from '@expirychecker/Components/Ads/Banner';

import {
	FloatButton,
	Icons,
} from '@expirychecker/Components/ListProducts/styles';

const Home: React.FC = () => {
	const { reset, canGoBack, navigate } =
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

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const allProducts = await getAllProducts({
				removeProductsWithoutBatches: true,
				removeTreatedBatch: true,
				sortProductsByExpDate: true,
			});

			setProducts(allProducts);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
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

	const handleSelectDateChange = useCallback((date: Date) => {
		setEnableDatePicker(false);

		let dateFormat = 'dd/MM/yyyy';
		if (getLocales()[0].languageCode === 'en') {
			dateFormat = 'MM/dd/yyyy';
		}
		const d = format(date, dateFormat);
		setSearchString(d);
		setSelectedDate(date);
	}, []);

	const handleOnCodeRead = useCallback(code => {
		setSearchString(code);
		setEnableBarCodeReader(false);
	}, []);

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

	return isLoading ? (
		<Loading />
	) : (
		<>
			{enableBarCodeReader ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleOnBarCodeReaderClose}
				/>
			) : (
				<Container>
					<Header listRef={listRef} />

					<NotificationsDenny />

					<OutdateApp />

					<Banner adFor="Home" />

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
						modal
						mode="date"
						open={enableDatePicker}
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
					/>

					{enableFloatAddButton && (
						<FloatButton
							icon={() => (
								<Icons
									name="add-outline"
									color="white"
									size={22}
								/>
							)}
							small
							label={strings.View_FloatMenu_AddProduct}
							onPress={handleNavigateAddProduct}
						/>
					)}
				</Container>
			)}
		</>
	);
};

export default Home;
