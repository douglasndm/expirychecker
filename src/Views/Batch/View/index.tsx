import React, {
	useCallback,
	useMemo,
	useState,
	useContext,
	useEffect,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { getLocales, getCurrencies } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ptBR, pt, enUS } from 'date-fns/locale';
import { formatCurrency } from 'react-native-format-currency';

import strings from '@shared/Locales';

import { captureException } from '@services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { shareText, shareTextWithImage } from '@utils/Share';

import { shareBatchToPDF } from '@utils/Share/Batch/toPDF';
import { shareString } from '@expirychecker/Utils/Batches/Share';
import { getProductById } from '@expirychecker/Utils/Products/Product/Get';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Button from '@components/Button';

import Banner from '@expirychecker/Components/Ads/Banner';

import {
	Container,
	BatchContainer,
	BatchTitle,
	BatchExpDate,
	BatchAmount,
	BatchPrice,
	BannerContainer,
	ProFeaturesContainer,
	Text,
} from './styles';

interface Props {
	product_id: number;
	batch_id: number;
}

const View: React.FC = () => {
	const { params } = useRoute();
	const { navigate, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const routeParams = params as Props;

	const { userPreferences } = useContext(PreferencesContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [product, setProduct] = useState<IProduct | null>(null);
	const [batch, setBatch] = useState<IBatch | null>(null);

	const [isSharing, setIsSharing] = useState<boolean>(false);
	const [isSharingTag, setIsSharingTag] = useState<boolean>(false);

	const languageCode = useMemo(() => {
		if (getLocales()[0].languageCode === 'BR') {
			return ptBR;
		}
		if (getLocales()[0].languageCode === 'pt') {
			return pt;
		}
		return enUS;
	}, []);

	const dateFormat = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'MM/dd/yyyy';
		}
		return 'dd/MM/yyyy';
	}, []);

	const productId = useMemo(() => {
		return routeParams.product_id;
	}, [routeParams.product_id]);

	const date = useMemo(() => {
		if (batch) {
			return batch.exp_date;
		}
		return new Date();
	}, [batch]);

	const expired = useMemo(() => {
		return isPast(date);
	}, [date]);

	const handleNaviEdit = useCallback(() => {
		navigate('EditLote', {
			productId,
			loteId: routeParams.batch_id,
		});
	}, [navigate, productId, routeParams.batch_id]);

	const handleShare = useCallback(async () => {
		if (!product || !batch) {
			return;
		}
		try {
			setIsSharing(true);

			const text = shareString(product, batch);

			if (product.photo || product.code) {
				let fileName: string | null = null;

				if (product.photo) {
					fileName = product.photo;
				} else if (product.code) {
					fileName = product.code;
				}

				if (fileName) {
					await shareTextWithImage({
						imageFileName: fileName,
						title: strings.View_ShareProduct_Title,
						message: text,
					});
					return;
				}
			}

			await shareText({
				title: strings.View_ShareProduct_Title,
				text,
			});
		} catch (err) {
			if (err instanceof Error)
				captureException({ error: err, showAlert: true });
		} finally {
			setIsSharing(false);
		}
	}, [product, batch]);

	const handleNavigateToDiscount = useCallback(() => {
		navigate('BatchDiscount', {
			batch_id: routeParams.batch_id,
		});
	}, [navigate, routeParams.batch_id]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const prod = await getProductById(productId);

			const b = prod.batches.find(l => l.id === routeParams.batch_id);

			setProduct(prod);
			if (b) setBatch(b);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [productId, routeParams.batch_id]);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData]);

	const whereIs: string = useMemo(() => {
		let text = `${strings.baseApp.View_Batch_WhereIs}: `;

		if (batch?.where_is === 'shelf') {
			text += strings.baseApp.View_Batch_WhereIs_Shelf;
		} else if (batch?.where_is === 'stock') {
			text += strings.baseApp.View_Batch_WhereIs_Stock;
		} else {
			text = '';
		}

		return text;
	}, [batch?.where_is]);

	const extraInfo = useMemo(() => {
		let text = `${strings.baseApp.View_Batch_ExtraInfo}: `;

		if (batch?.additional_data) {
			text += batch.additional_data;
		} else {
			text = '';
		}
		return text;
	}, [batch?.additional_data]);

	const handlePrint = useCallback(async () => {
		if (!product || !batch) return;

		try {
			setIsSharingTag(true);

			await shareBatchToPDF({
				productName: product.name,
				batch,
			});
		} catch (err) {
			if (err instanceof Error) {
				captureException({ error: err, showAlert: true });
			}
		} finally {
			setIsSharingTag(false);
		}
	}, [batch, product]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_Batch_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'square-edit-outline',
						onPress: handleNaviEdit,
					},
				]}
			/>

			{!!batch && (
				<BatchContainer>
					<BatchTitle>{batch.name}</BatchTitle>

					<BatchExpDate>
						{expired
							? strings.ProductCardComponent_ProductExpiredIn
							: strings.ProductCardComponent_ProductExpireIn}

						{` ${formatDistanceToNow(date, {
							addSuffix: true,
							locale: languageCode,
						})}`}

						{`${format(date, `, EEEE, ${dateFormat}`, {
							locale: languageCode,
						})}`}
					</BatchExpDate>

					{!!batch.amount && (
						<BatchAmount>{`${strings.View_Batch_Amount}: ${batch.amount}`}</BatchAmount>
					)}

					{!!batch.price && (
						<BatchPrice>
							{`${strings.View_Batch_UnitPrice} ${
								formatCurrency({
									amount: Number(batch.price.toFixed(2)),
									code: getCurrencies()[0],
								})[0]
							}`}
						</BatchPrice>
					)}

					{!!batch.price_tmp && (
						<BatchPrice>
							{`${strings.View_Batch_UnitTempPrice} ${
								formatCurrency({
									amount: Number(batch.price_tmp.toFixed(2)),
									code: getCurrencies()[0],
								})[0]
							}`}
						</BatchPrice>
					)}

					{!!batch.price && !!batch.amount && (
						<BatchPrice>
							{`${strings.View_Batch_TotalPrice}: ${
								formatCurrency({
									amount: Number(
										(batch.price * batch.amount).toFixed(2)
									),
									code: getCurrencies()[0],
								})[0]
							}`}
						</BatchPrice>
					)}

					{!!batch.price_tmp && !!batch.amount && (
						<BatchPrice>
							{`${strings.View_Batch_TotalPriceDiscount} ${
								formatCurrency({
									amount: Number(
										(
											batch.price_tmp * batch.amount
										).toFixed(2)
									),
									code: getCurrencies()[0],
								})[0]
							}`}
						</BatchPrice>
					)}
					{userPreferences.isPRO && !!whereIs && (
						<Text>{whereIs}</Text>
					)}
					{userPreferences.isPRO && !!extraInfo && (
						<Text>{extraInfo}</Text>
					)}

					{!userPreferences.disableAds && (
						<BannerContainer>
							<Banner
								adFor="BatchView"
								size={BannerAdSize.MEDIUM_RECTANGLE}
							/>
						</BannerContainer>
					)}

					<ProFeaturesContainer>
						<Button
							title={
								strings.baseApp.View_Batch_Button_Print_Batch
							}
							onPress={handlePrint}
							isLoading={isSharingTag}
							contentStyle={{ width: 250 }}
							disabled={!userPreferences.isPRO}
						/>

						<Button
							title={
								strings.View_Batch_Button_ShareWithAnotherApps
							}
							onPress={handleShare}
							isLoading={isSharing}
							contentStyle={{ width: 250 }}
							disabled={!userPreferences.isPRO}
						/>

						{!!batch.price && (
							<Button
								title={strings.View_Batch_Discount_Button_Apply}
								onPress={handleNavigateToDiscount}
								contentStyle={{ marginTop: -5, width: 250 }}
								disabled={!userPreferences.isPRO}
							/>
						)}
					</ProFeaturesContainer>
				</BatchContainer>
			)}
		</Container>
	);
};

export default View;
