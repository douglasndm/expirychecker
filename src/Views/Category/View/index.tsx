import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import Loading from '@components/Loading';
import Header from '@components/Header';

import {
	Container,
	ActionsContainer,
	ActionButtonsContainer,
	Icons,
	ActionText,
} from '@styles/Views/GenericViewPage';

import strings from '~/Locales';

import { exportToExcel } from '~/Utils/Excel/Export';

import {
	getAllCategories,
	getAllProductsByCategory,
} from '~/Functions/Category';
import {
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '~/Functions/Products';

import ListProducts from '~/Components/ListProducts';

import {
	FloatButton,
	Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

interface Props {
	id: string;
}

const CategoryView: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const routeParams = params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [categoryName, setCategoryName] = useState<string>('CategoryTitle');

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const categories = await getAllCategories();
			const findCat = categories.find(c => c.id === routeParams.id);

			if (findCat) {
				setCategoryName(findCat.name);
			}

			const prods = await getAllProductsByCategory(routeParams.id);

			// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
			const sortedProds = sortProductsLotesByLotesExpDate(prods);

			// DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
			// CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
			// DE QUAL ESTÁ MAIS PRÓXIMO
			const results = sortProductsByFisrtLoteExpDate(sortedProds);

			setProducts(results);
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

	const handleEdit = useCallback(() => {
		navigate('CategoryEdit', { id: routeParams.id });
	}, [navigate, routeParams.id]);

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', { category: routeParams.id });
	}, [navigate, routeParams.id]);

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				sortBy: 'expire_date',
				category: routeParams.id,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_CategoryView');

			showMessage({
				message: strings.View_Category_View_ExcelExportedSuccess,
				type: 'info',
			});
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
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={`${strings.View_Category_List_View_BeforeCategoryName} ${categoryName}`}
				noDrawer
			/>

			<ActionsContainer>
				<ActionButtonsContainer onPress={handleEdit}>
					<ActionText>
						{strings.View_ProductDetails_Button_UpdateProduct}
					</ActionText>
					<Icons name="create-outline" size={22} />
				</ActionButtonsContainer>

				<ActionButtonsContainer onPress={handleExportExcel}>
					<ActionText>
						{strings.View_Brand_View_ActionButton_GenereteExcel}
					</ActionText>
					<Icons name="stats-chart-outline" size={22} />
				</ActionButtonsContainer>
			</ActionsContainer>

			<ListProducts products={products} />

			<FloatButton
				icon={() => (
					<FloatIcon name="add-outline" color="white" size={22} />
				)}
				small
				label={strings.View_FloatMenu_AddProduct}
				onPress={handleNavigateAddProduct}
			/>
		</Container>
	);
};

export default CategoryView;
