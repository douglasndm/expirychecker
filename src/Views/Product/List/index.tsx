import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import remoteConfig from '@react-native-firebase/remote-config';
import { showMessage } from 'react-native-flash-message';

import Header from '@components/Header';
import BarCodeReader from '@components/BarCodeReader';

import {
	InputSearch,
	InputTextContainer,
	InputTextIconContainer,
	InputTextIcon,
} from '@views/Home/styles';

import Loading from '@components/Loading';
import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import ListProducts from '~/Components/ListProducts';

import { getAllProducts, searchForAProductInAList } from '~/Functions/Products';

import { FloatButton, Icons } from '~/Components/ListProducts/styles';

import { Container } from './styles';

const List: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const enableTabBar = remoteConfig().getValue('enable_app_bar');
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [products, setProducts] = useState<Array<IProduct>>([]);

	const [searchString, setSearchString] = useState<string>();
	const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
	const [enableBarCodeReader, setEnableBarCodeReader] =
		useState<boolean>(false);

	const getProducts = useCallback(async () => {
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
		getProducts();
	}, [getProducts]);

	useEffect(() => {
		setProductsSearch(products);
	}, [products]);

	const handleOnBarCodeReaderOpen = useCallback(() => {
		setEnableBarCodeReader(true);
	}, []);

	const handleOnBarCodeReaderClose = useCallback(() => {
		setEnableBarCodeReader(false);
	}, []);

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
		code => {
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
				<>
					<Container>
						<Header title={strings.View_AllProducts_PageTitle} />

						{products.length > 0 && (
							<InputTextContainer>
								<InputSearch
									placeholder={
										strings.View_AllProducts_SearchPlaceholder
									}
									value={searchString}
									onChangeText={handleSearchChange}
								/>
								<InputTextIconContainer
									onPress={handleOnBarCodeReaderOpen}
								>
									<InputTextIcon name="barcode-outline" />
								</InputTextIconContainer>
							</InputTextContainer>
						)}

						<ListProducts products={productsSearch} />

						{!userPreferences.isPRO ||
							(userPreferences.isPRO &&
								enableTabBar.asBoolean() === false && (
									<FloatButton
										icon={() => (
											<Icons
												name="add-outline"
												color="white"
												size={22}
											/>
										)}
										small
										label={
											strings.View_FloatMenu_AddProduct
										}
										onPress={handleNavigateAddProduct}
									/>
								))}
					</Container>
				</>
			)}
		</>
	);
};

export default List;
