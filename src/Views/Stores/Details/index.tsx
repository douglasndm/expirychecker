import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { exportToExcel } from '@utils/Excel/Export';
import {
	getAllProducts,
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import {
	getAllStores,
	getAllProductsByStore,
	getStore,
} from '@expirychecker/Functions/Stores';
import { getAllBrands } from '@expirychecker/Utils/Brands';

import Loading from '@components/Loading';
import Header from '@components/Header';
import FAB from '@components/FAB';

import {
	Container,
	ActionsContainer,
	ActionButtonsContainer,
	Icons,
	ActionText,
	SubTitle,
} from '@styles/Views/GenericViewPage';

import ListProducts from '@expirychecker/Components/ListProducts';

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

	const [isLoading, setIsLoading] = useState<boolean>(true);

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

			// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
			const sortedProds = sortProductsLotesByLotesExpDate(results);

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

	const handleNavigateAddProduct = useCallback(() => {
		navigate('AddProduct', { store });
	}, [navigate, store]);

	const handleNavigateEditStore = useCallback(() => {
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

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header title={strings.View_Store_View_PageTitle} noDrawer />

			{store !== '000' && (
				<ActionsContainer>
					<ActionButtonsContainer onPress={handleNavigateEditStore}>
						<ActionText>
							{strings.View_Store_View_Button_EditStore}
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
			)}

			<SubTitle>{storeName}</SubTitle>
			<ListProducts products={products} />

			<FAB
				icon="plus"
				label={strings.View_FloatMenu_AddProduct}
				onPress={handleNavigateAddProduct}
			/>
		</Container>
	);
};

export default StoreDetails;
