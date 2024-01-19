import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import remoteConfig from '@react-native-firebase/remote-config';
import { showMessage } from 'react-native-flash-message';
import { getLocales } from 'react-native-localize';
import { format } from 'date-fns';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';
import { useDrawer } from '@expirychecker/Contexts/Drawer';

import { searchProducts } from '@utils/Product/Search';

import {
	getAllProducts,
	searchForAProductInAList,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';
import { deleteManyProducts } from '@expirychecker/Utils/Products';

import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';
import SearchBar from '@components/SearchBar';
import DatePicker from '@components/DatePicker';
import ListProds from '@components/Product/List';
import FAB from '@components/FAB';

import { Container } from '@views/Home/styles';

const List: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);
	const { toggleDrawer } = useDrawer();

	interface listProdsRefProps {
		switchDeleteModal: () => void;
		switchSelectMode: () => void;
	}

	const listProdsRef = useRef<listProdsRefProps>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [products, setProducts] = useState<Array<IProduct>>([]);

	const [searchString, setSearchString] = useState<string>('');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [enableBarCodeReader, setEnableBarCodeReader] =
		useState<boolean>(false);

	const [enableDatePicker, setEnableDatePicker] = useState(false);
	const [enableSearch, setEnableSearch] = useState(false);
	const [selectMode, setSelectMode] = useState(false);

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

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const allProducts = await getAllProducts({
				sortProductsByExpDate: true,
				removeTreatedBatch: true,
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
		loadData();
	}, [loadData]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

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

	const handleDeleteMany = useCallback(
		async (productsIds: number[] | string[]) => {
			try {
				const ids = productsIds.map(id => {
					return Number(id);
				});
				await deleteManyProducts({ productsIds: ids });

				if (loadData) {
					loadData();
				}

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

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchString(search);

			if (search && search !== '') {
				const findProducts = searchForAProductInAList({
					products,
					searchFor: search,
					sortByExpDate: true,
				});

				setProductsSearch(findProducts);
			} else {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleOnCodeRead = useCallback(
		(code: string) => {
			setSearchString(code);
			handleSearchChange(code);
			setEnableBarCodeReader(false);
		},
		[handleSearchChange]
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

	const barActions = useMemo(() => {
		const actions = [];

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
		handleSwitchEnableDatePicker,
		handleSwitchEnableSearch,
		handleSwitchBarCodeOpen,
		handleSwitchSelectMode,
		selectMode,
		userPreferences.isPRO,
	]);

	return (
		<>
			{enableBarCodeReader ? (
				<BarCodeReader
					onCodeRead={handleOnCodeRead}
					onClose={handleSwitchBarCodeOpen}
				/>
			) : (
				<Container>
					<Header
						title={strings.View_AllProducts_PageTitle}
						onMenuPress={toggleDrawer}
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
						isRefreshing={isLoading}
						onRefresh={loadData}
						setSelectModeOnParent={setSelectMode}
						handleDeleteMany={handleDeleteMany}
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
				</Container>
			)}
		</>
	);
};

export default List;
