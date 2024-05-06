import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import BootSplash from 'react-native-bootsplash';
import remoteConfig from '@react-native-firebase/remote-config';
import { showMessage } from 'react-native-flash-message';
import { BannerAdSize } from 'react-native-google-mobile-ads';

import strings from '@expirychecker/Locales';

import { captureException } from '@services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';
import ListContext from '@shared/Contexts/ListContext';

import { searchProducts } from '@utils/Product/Search';

import { deleteManyProducts } from '@expirychecker/Utils/Products';
import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';

import { sortProductsLotesByLotesExpDate } from '@expirychecker/Functions/Products';

import BarCodeReader from '@components/BarCodeReader';
import SearchBar from '@components/SearchBar';
import DatePicker, { IDatePickerResponse } from '@components/DatePicker';
import NotificationsDenny from '@components/Warnings/NotificationsDenny';
import OutdateApp from '@components/Warnings/OutdateApp';
import FAB from '@components/FAB';
import ListProds from '@components/Product/List';

import Header from '@expirychecker/Components/Header';
import AdsConsentComponent from '@expirychecker/Components/Ads/AdsConsent';
import Banner from '@expirychecker/Components/Ads/Banner';
import ExpiredModal from '@expirychecker/Components/Subscription/ExpiredModal';
import AccountLogin from '@expirychecker/Components/Banners/AccountLogin';

import { Container } from '@views/Home/styles';

const Home: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);
	const { setCurrentList } = useContext(ListContext);

	interface listProdsRefProps {
		switchDeleteModal: () => void;
		switchSelectMode: () => void;
	}

	const listRef = useRef<FlatList<IProduct>>(null);
	const listProdsRef = useRef<listProdsRefProps>();

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
	const [enableSearch, setEnableSearch] = useState(false);

	const [selectMode, setSelectMode] = useState(false);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const allProducts = await getAllProductsAsync({
				sortProductsByExpDate: true,
				removeTreatedBatch: true,
			});

			setProducts(allProducts);
		} catch (err) {
			if (err instanceof Error) {
				captureException(err);

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

	const handleSwitchEnableSearch = useCallback(() => {
		setEnableSearch(prevState => !prevState);
	}, []);

	const handleSwitchBarCodeOpen = useCallback(() => {
		setEnableBarCodeReader(prevState => !prevState);
	}, []);

	const handleSwitchEnableDatePicker = useCallback(() => {
		setEnableDatePicker(prevState => {
			// if (prevState === false) this means that will be true now
			// so the search bar needs to be active for user to see the date fill
			if (prevState === false) {
				setEnableSearch(true);
			}
			return !prevState;
		});
	}, []);

	const cleanSearch = useCallback(() => {
		setProductsSearch([]);
		setSearchString('');
	}, []);

	const handleSelectDateChange = useCallback(
		({ date, dateString }: IDatePickerResponse) => {
			cleanSearch();

			setEnableDatePicker(false);

			setSearchString(dateString);
			setSelectedDate(date);

			let prods: IProduct[] = [];
			if (dateString && dateString !== '') {
				prods = searchProducts({
					products,
					query: dateString,
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

	const handleDeleteMany = useCallback(
		async (productsIds: number[] | string[]) => {
			try {
				const ids = productsIds.map(id => {
					return Number(id);
				});
				await deleteManyProducts({ productsIds: ids });

				await loadData();

				showMessage({
					message:
						strings.ListProductsComponent_ProductsDeleted_Notification,
					type: 'info',
				});

				setSelectMode(false);
			} catch (err) {
				if (err instanceof Error)
					showMessage({
						message: err.message,
						type: 'danger',
					});
			}
		},
		[loadData]
	);

	const handleSwitchDeleteModal = useCallback(() => {
		if (listProdsRef.current) {
			listProdsRef.current.switchDeleteModal();
		}
	}, []);

	const handleSwitchSelectMode = useCallback(() => {
		if (listProdsRef.current) {
			listProdsRef.current.switchSelectMode();
		}
	}, []);

	useEffect(() => {
		setCurrentList(listRef);
	}, [setCurrentList]);

	interface IAction {
		icon: string;
		onPress: () => void;
	}

	const barActions = useMemo(() => {
		const actions: IAction[] = [];

		if (products.length <= 0) return actions;

		if (userPreferences.isPRO) {
			actions.push({
				icon: 'calendar',
				onPress: handleSwitchEnableDatePicker,
			});
		}
		actions.push({
			icon: 'barcode-scan',
			onPress: handleSwitchBarCodeOpen,
		});
		actions.push({
			icon: 'magnify',
			onPress: handleSwitchEnableSearch,
		});

		if (selectMode) {
			actions.push({
				icon: 'cancel',
				onPress: handleSwitchSelectMode,
			});
		}

		return actions;
	}, [
		products.length,
		userPreferences.isPRO,
		handleSwitchBarCodeOpen,
		handleSwitchEnableSearch,
		selectMode,
		handleSwitchEnableDatePicker,
		handleSwitchSelectMode,
	]);

	return (
		<Container>
			<AdsConsentComponent />
			<ExpiredModal />
			{enableBarCodeReader ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleSwitchBarCodeOpen}
				/>
			) : (
				<>
					<Header
						listRef={listRef}
						appBarActions={barActions}
						moreMenuItems={
							!selectMode
								? []
								: [
										{
											title: strings.ListProductsComponent_DeleteProducts_Modal_Button_Delete,
											leadingIcon: 'trash-can-outline',
											onPress: handleSwitchDeleteModal,
										},
								  ]
						}
					/>

					<AccountLogin />

					<NotificationsDenny />

					<OutdateApp />

					{!userPreferences.isPRO && (
						<Banner adFor="Home" size={BannerAdSize.LARGE_BANNER} />
					)}

					{products.length > 0 && enableSearch && (
						<SearchBar
							searchValue={searchString}
							onSearchChange={handleSearchChange}
							handleSearch={handleSearch}
						/>
					)}

					<DatePicker
						isOpen={enableDatePicker}
						date={selectedDate}
						onConfirm={handleSelectDateChange}
						onCancel={handleSwitchEnableDatePicker}
					/>

					<ListProds
						ref={listProdsRef}
						products={productsSearch}
						listRef={listRef}
						handleDeleteMany={handleDeleteMany}
						isRefreshing={isLoading}
						onRefresh={loadData}
						setSelectModeOnParent={setSelectMode}
						disableImage={!userPreferences.isPRO}
						disableFilters={!userPreferences.isPRO}
						daysToBeNext={
							userPreferences.howManyDaysToBeNextToExpire
						}
					/>

					{enableFloatAddButton && (
						<FAB
							icon="plus"
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
