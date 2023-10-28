import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { exportToExcel } from '@utils/Excel/Export';
import { removeCheckedBatches } from '@utils/Product/Batches';
import { searchProducts } from '@utils/Product/Search';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import {
	getAllProducts,
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import {
	getAllProductsByStore,
	getStore,
} from '@expirychecker/Functions/Stores';
import { getAllBrands } from '@expirychecker/Utils/Brands';

import Header from '@components/Products/List/Header';
import ListProds from '@components/Product/List';
import FAB from '@components/FAB';

import { Container, SubTitle } from '@styles/Views/GenericViewPage';

interface RequestProps {
	route: {
		params: {
			store: string; // can be the name too
		};
	};
}

const StoreDetails: React.FC<RequestProps> = ({ route }: RequestProps) => {
	const { navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const [storeName, setStoreName] = useState<string>('');
	const [products, setProducts] = useState<IProduct[]>([]);

	const { store } = route.params;

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			let results: Array<IProduct> = [];

			if (store === '000') {
				setStoreName(strings.View_AllProductByStore_NoStore);
				results = await getAllProductsByStore(null);
			} else {
				results = await getAllProductsByStore(store);

				const s = await getStore(store);

				if (s) {
					setStoreName(s.name);
				} else {
					setStoreName(store);
				}
			}

			const noCheckeds: IProduct[] = results.map(prod => ({
				...JSON.parse(JSON.stringify(prod)), // for deep clone Zzzz
				batches: removeCheckedBatches(prod.batches),
			}));

			// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
			const sortedProds = sortProductsLotesByLotesExpDate(noCheckeds);

			// DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
			// CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
			// DE QUAL ESTÁ MAIS PRÓXIMO
			const sortedProductsFinal =
				sortProductsByFisrtLoteExpDate(sortedProds);

			setProducts(sortedProductsFinal);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [store]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', { store });
	}, [navigate, store]);

	const handleEdit = useCallback(() => {
		navigate('StoreEdit', { store_id: store });
	}, [navigate, store]);

	const getProducts = async () => getAllProducts({});

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				getProducts,
				store,
				getBrands: getAllBrands,
				getCategories: getAllCategories,
				getStores: getAllStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_StoreView');

			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('User did not share'))
					showMessage({
						message: err.message,
						type: 'danger',
					});
		} finally {
			setIsLoading(false);
		}
	}, [store]);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	const handleSearchChange = useCallback(
		async (search: string) => {
			setSearchQuery(search);

			if (search.trim() === '') {
				setProductsSearch(products);
			}
		},
		[products]
	);

	const handleSearch = useCallback(
		(value?: string) => {
			const query = value && value.trim() !== '' ? value : searchQuery;

			let prods: IProduct[] = [];

			if (query && query !== '') {
				prods = searchProducts({
					products,
					query,
				});
			}

			prods = sortProductsLotesByLotesExpDate(prods);

			setProductsSearch(prods);
		},
		[products, searchQuery]
	);

	return (
		<Container>
			<Header
				title={strings.View_Store_View_PageTitle}
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				handleSearch={handleSearch}
				exportToExcel={store !== '000' ? handleExportExcel : undefined}
				navigateToEdit={store !== '000' ? handleEdit : undefined}
			/>

			<SubTitle>{storeName}</SubTitle>
			<ListProds
				products={productsSearch}
				isRefreshing={isLoading}
				onRefresh={loadData}
				daysToBeNext={userPreferences.howManyDaysToBeNextToExpire}
			/>

			<FAB
				icon="plus"
				label={strings.View_FloatMenu_AddProduct}
				onPress={handleNavigateAddProduct}
			/>
		</Container>
	);
};

export default StoreDetails;
