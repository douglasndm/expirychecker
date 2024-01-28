import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import Ionicons from 'react-native-vector-icons/Ionicons';

import strings from '@expirychecker/Locales';

import { captureException } from '@expirychecker/Services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { sortBatches } from '@expirychecker/Utils/Batches/Sort';
import { getLocalImageFromProduct } from '@utils/Product/Image/GetLocalImage';

import { getProductById } from '@expirychecker/Functions/Product';
import { getStore } from '@expirychecker/Functions/Stores';
import { deleteManyBatches } from '@expirychecker/Utils/Batches';
import { getImagePath } from '@utils/Images/GetImagePath';
import { saveLocally } from '@utils/Images/SaveLocally';

import Loading from '@components/Loading';
import Header from '@components/Header';

import PageHeader from '@views/Product/View/Components/PageHeader';

import Banner from '@expirychecker/Components/Ads/Banner';

import BatchTable from '@views/Product/View/Components/BatchesTable';

import {
	Container,
	Content,
	PageContent,
	CategoryDetails,
	CategoryDetailsText,
	TableContainer,
	FloatButton,
} from '@views/Product/View/styles';

interface Request {
	route: {
		params: {
			id: number;
		};
	};
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
	const { isConnected } = useNetInfo();

	const { userPreferences } = useContext(PreferencesContext);

	const { push, goBack, addListener, reset, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const productId = useMemo(() => {
		return route.params.id;
	}, [route.params.id]);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [product, setProduct] = useState<IProduct>();
	const [image, setImage] = useState<string | undefined>();
	const [storeName, setStoreName] = useState<string | null>();

	const [lotesTratados, setLotesTratados] = useState<Array<IBatch>>([]);
	const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<IBatch>>([]);

	const getProduct = useCallback(async () => {
		setIsLoading(true);
		try {
			const result = await getProductById(productId);

			// When the product doesn't exists it will reset the view for app get new data
			if (!result) {
				reset({
					routes: [{ name: 'Home' }],
				});
				return;
			}

			if (result.photo || result.code) {
				let path: string | null = null;

				if (result.photo) {
					path = await getLocalImageFromProduct(result.photo);
				} else if (result.code) {
					path = await getLocalImageFromProduct(result.code.trim());
				}

				if (path) {
					setImage(`${path}`);
				} else if (!path && result.code && isConnected) {
					const response = await getImagePath({
						productCode: result.code.trim(),
					});

					if (response) {
						setImage(response);

						await saveLocally(response, result.code.trim());
					}
				}
			}

			if (!result || result === null) {
				goBack();
				return;
			}

			setProduct(result);

			if (result.batches.length > 0) {
				const lotesSorted = sortBatches(result.batches);

				setLotesTratados(() =>
					lotesSorted.filter(lote => lote.status === 'Tratado')
				);

				setLotesNaoTratados(() =>
					lotesSorted.filter(lote => lote.status !== 'Tratado')
				);
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});

				captureException(err);
			}
		} finally {
			setIsLoading(false);
		}
	}, [productId, reset, isConnected, goBack]);

	useEffect(() => {
		if (product?.store) {
			getStore(product.store).then(response =>
				setStoreName(response?.name)
			);
		}
	}, [product]);

	const addNewLote = useCallback(() => {
		push('AddBatch', { productId });
	}, [productId, push]);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			getProduct();
		});

		return unsubscribe;
	}, [addListener, getProduct]);

	const onDeleteManyBathes = useCallback(async (ids: number[]) => {
		try {
			setIsLoading(true);

			await deleteManyBatches(ids);

			setLotesNaoTratados([]);
			setLotesTratados([]);

			await getProduct();
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

	const handleEdit = useCallback(() => {
		navigate('EditProduct', { productId });
	}, [navigate, productId]);

	return (
		<>
			<Container>
				<Header
					title={strings.View_ProductDetails_PageTitle}
					noDrawer
					appBarActions={[
						{
							icon: 'square-edit-outline',
							onPress: handleEdit,
						},
					]}
				/>

				{isLoading ? (
					<Loading />
				) : (
					<Content>
						{product && (
							<PageHeader
								product={product}
								imagePath={
									!userPreferences.isPRO ? undefined : image
								}
								storeName={storeName}
								enableStore={userPreferences.multiplesStores}
							/>
						)}
						<PageContent>
							{lotesNaoTratados.length > 0 && (
								<TableContainer>
									<CategoryDetails>
										<CategoryDetailsText>
											{
												strings.View_ProductDetails_TableTitle_NotTreatedBatches
											}
										</CategoryDetailsText>
									</CategoryDetails>

									<BatchTable
										batches={lotesNaoTratados}
										product={product}
										onDeleteMany={onDeleteManyBathes}
										daysToBeNext={
											userPreferences.howManyDaysToBeNextToExpire
										}
									/>
								</TableContainer>
							)}

							<Banner
								adFor="ProductView"
								size={BannerAdSize.MEDIUM_RECTANGLE}
							/>

							{lotesTratados.length > 0 && (
								<>
									<CategoryDetails>
										<CategoryDetailsText>
											{
												strings.View_ProductDetails_TableTitle_TreatedBatches
											}
										</CategoryDetailsText>
									</CategoryDetails>

									<BatchTable
										batches={lotesTratados}
										product={product}
										onDeleteMany={onDeleteManyBathes}
									/>
								</>
							)}
						</PageContent>
					</Content>
				)}
			</Container>

			<FloatButton
				icon={() => (
					<Ionicons name="add-outline" color="white" size={22} />
				)}
				small
				label={strings.View_ProductDetails_FloatButton_AddNewBatch}
				onPress={addNewLote}
			/>
		</>
	);
};

export default ProductDetails;
