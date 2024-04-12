import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';
import sharedStrings from '@shared/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllProductsWithoutCategory } from '@expirychecker/Utils/Categories/Products/GetProductsWithoutCategories';
import { exportToExcel } from '@utils/Excel/Export';
import { removeCheckedBatches } from '@utils/Product/Batches';
import { searchProducts } from '@utils/Product/Search';
import {
	getAllProducts,
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';
import { getAllProductsByCategory } from '@expirychecker/Functions/Category';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { captureException } from '@services/ExceptionsHandler';

import Header from '@components/Products/List/Header';
import ListProds from '@components/Product/List';
import FAB from '@components/FAB';

import { Container, SubTitle } from '@styles/Views/GenericViewPage';

interface Props {
	id: string | null;
}

const CategoryView: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const routeParams = params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	const [categoryName, setCategoryName] = useState<string>('CategoryTitle');

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			if (routeParams.id) {
				const categories = await getAllCategories();
				const findCat = categories.find(c => c.id === routeParams.id);

				if (findCat) {
					setCategoryName(findCat.name);
				}

				const prods = await getAllProductsByCategory(routeParams.id);

				const noCheckeds: IProduct[] = prods.map(prod => ({
					...JSON.parse(JSON.stringify(prod)), // for deep clone Zzzz
					batches: removeCheckedBatches(prod.batches),
				}));

				// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
				const sortedProds = sortProductsLotesByLotesExpDate(noCheckeds);

				// DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
				// CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
				// DE QUAL ESTÁ MAIS PRÓXIMO
				const results = sortProductsByFisrtLoteExpDate(sortedProds);

				setProducts(results);
			} else {
				setCategoryName(
					sharedStrings.View_Category_List_View_NoCategoryName
				);
				const prods = await getAllProductsWithoutCategory();
				setProducts(prods);
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.id]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleEdit = useCallback(() => {
		if (routeParams.id) navigate('CategoryEdit', { id: routeParams.id });
	}, [navigate, routeParams.id]);

	const handleNavigateAddProduct = useCallback(() => {
		if (routeParams.id)
			navigate('AddProduct', { category: routeParams.id });
	}, [navigate, routeParams.id]);

	const getProducts = async () => getAllProducts({});

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				getProducts,
				category: routeParams.id,
				getBrands: getAllBrands,
				getCategories: getAllCategories,
				getStores: getAllStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_CategoryView');

			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error) {
				if (err.message.includes('did not share')) return;
				showMessage({
					message: err.message,
					type: 'danger',
				});

				captureException(err);
			}
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

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
				title={strings.View_Category_List_View_BeforeCategoryName}
				searchValue={searchQuery}
				onSearchChange={handleSearchChange}
				handleSearch={handleSearch}
				exportToExcel={handleExportExcel}
				navigateToEdit={routeParams.id ? handleEdit : undefined}
				productsCount={products.length}
			/>

			<SubTitle>{categoryName}</SubTitle>

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

export default CategoryView;
