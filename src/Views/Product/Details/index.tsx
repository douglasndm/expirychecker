import React, {
	useState,
	useEffect,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import Ionicons from 'react-native-vector-icons/Ionicons';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { sortBatches } from '@expirychecker/Utils/Batches/Sort';
import { getProductById } from '@expirychecker/Functions/Product';
import { getStore } from '@expirychecker/Functions/Stores';
import { getProductImagePath } from '@expirychecker/Functions/Products/Image';
import { deleteManyBatches } from '@expirychecker/Utils/Batches';
import { getImagePath } from '@utils/Images/GetImagePath';

import Loading from '@components/Loading';
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
	const { userPreferences } = useContext(PreferencesContext);

	const { push, goBack, addListener, reset } =
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

			if (result.photo) {
				const imagePath = await getProductImagePath(productId);

				if (imagePath) {
					if (Platform.OS === 'android') {
						setImage(`file://${imagePath}`);
					} else if (Platform.OS === 'ios') {
						setImage(imagePath);
					}
				}
			} else if (result.code && userPreferences.isPRO) {
				const response = await getImagePath({
					productCode: result.code,
				});

				setImage(response);
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
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [productId, userPreferences.isPRO, reset, goBack]);

	useEffect(() => {
		if (product?.store) {
			getStore(product.store).then(response =>
				setStoreName(response?.name)
			);
		}
	}, [product]);

	const addNewLote = useCallback(() => {
		push('AddLote', { productId });
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

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Container>
				<Content>
					<PageHeader
						product={product}
						imagePath={image}
						storeName={storeName}
						enableStore={userPreferences.multiplesStores}
					/>
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
