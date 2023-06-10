import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { exportToExcel } from '@utils/Excel/Export';
import { removeCheckedBatches } from '@utils/Product/Batches';
import {
	getAllProducts,
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Functions/Stores';
import {
	getAllBrands,
	getAllProductsByBrand,
} from '@expirychecker/Utils/Brands';

import Loading from '@components/Loading';
import Header from '@components/Header';
import FAB from '@components/FAB';

import ListProducts from '@expirychecker/Components/ListProducts';

import {
	Container,
	ActionsContainer,
	ActionButtonsContainer,
	Icons,
	ActionText,
	SubTitle,
} from '@styles/Views/GenericViewPage';

interface Props {
	brand_id: string;
}

const View: React.FC = () => {
	const { params } = useRoute();
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const routeParams = params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [brandName, setBrandName] = useState<string>('Brand Name');

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const brands = await getAllBrands();
			const findCat = brands.find(c => c.id === routeParams.brand_id);

			if (findCat) {
				setBrandName(findCat.name);
			}

			const prods = await getAllProductsByBrand(routeParams.brand_id);

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
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.brand_id]);

	const handleEdit = useCallback(() => {
		navigate('BrandEdit', { brand_id: routeParams.brand_id });
	}, [navigate, routeParams.brand_id]);

	const getProducts = async () => getAllProducts({});

	const handleGenereteExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				getProducts,
				brand: routeParams.brand_id,
				getBrands: getAllBrands,
				getCategories: getAllCategories,
				getStores: getAllStores,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_BrandView');

			showMessage({
				message: strings.View_Brand_View_SuccessExportExcel,
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
	}, [routeParams.brand_id]);

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', { brand: routeParams.brand_id });
	}, [navigate, routeParams.brand_id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header title={`${strings.View_Brand_View_PageTitle}`} noDrawer />

			<ActionsContainer>
				<ActionButtonsContainer onPress={handleEdit}>
					<ActionText>
						{strings.View_ProductDetails_Button_UpdateProduct}
					</ActionText>
					<Icons name="create-outline" size={22} />
				</ActionButtonsContainer>

				<ActionButtonsContainer onPress={handleGenereteExcel}>
					<ActionText>
						{strings.View_Brand_View_ActionButton_GenereteExcel}
					</ActionText>
					<Icons name="stats-chart-outline" size={22} />
				</ActionButtonsContainer>
			</ActionsContainer>

			<SubTitle>{brandName}</SubTitle>
			<ListProducts products={products} onRefresh={loadData} />

			<FAB
				icon="plus"
				label={strings.View_FloatMenu_AddProduct}
				onPress={handleNavigateAddProduct}
			/>
		</Container>
	);
};

export default View;
