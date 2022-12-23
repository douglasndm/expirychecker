import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
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

import { getAllProductsByStore, getStore } from '~/Functions/Stores';
import {
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '~/Functions/Products';

import ListProducts from '~/Components/ListProducts';
import {
	FloatButton,
	Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

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

	const handleExportExcel = useCallback(async () => {
		try {
			setIsLoading(true);

			await exportToExcel({
				sortBy: 'expire_date',
				store,
			});

			if (!__DEV__)
				Analytics().logEvent('Exported_To_Excel_From_StoreView');

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
			<Header title={storeName} noDrawer />

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

export default StoreDetails;
