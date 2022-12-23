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
import { format, formatDistanceToNow, isPast } from 'date-fns';//eslint-disable-line
import { ptBR, pt, enUS } from 'date-fns/locale' // eslint-disable-line
import { formatCurrency } from 'react-native-format-currency';

import Header from '@components/Header';
import Button from '@components/Button';
import Loading from '@components/Loading';
import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { ShareProductImageWithText } from '~/Functions/Share';

import {
	ActionsButtonContainer,
	ButtonPaper,
} from '~/Views/Product/Edit/styles';

import { PageHeader, Icons } from '../Edit/styles';

import {
	Container,
	BatchContainer,
	BatchTitle,
	BatchExpDate,
	BatchAmount,
	BatchPrice,
	BannerContainer,
	ProFeaturesContainer,
	ProFeaturesText,
} from './styles';

import { getProductById } from '~/Functions/Product';
import Banner from '~/Components/Ads/Banner';

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
	const [batch, setBatch] = useState<ILote | null>(null);

	const [isSharing, setIsSharing] = useState<boolean>(false);

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

	const exp_date = useMemo(() => {
		return format(date, dateFormat, {
			locale: languageCode,
		});
	}, [date, dateFormat, languageCode]);

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

			let text = strings.View_ShareProduct_Message;

			if (!!batch.amount && batch.amount > 0) {
				if (!!batch.price_tmp) {
					text =
						strings.View_ShareProduct_MessageWithDiscountAndAmount;

					text = text.replace(
						'{TMP_PRICE}',
						formatCurrency({
							amount: Number(batch.price_tmp.toFixed(2)),
							code: getCurrencies()[0],
						})[0]
					);
					text = text.replace(
						'{TOTAL_DISCOUNT_PRICE}',
						formatCurrency({
							amount: Number(
								(batch.price_tmp * batch.amount).toFixed(2)
							),
							code: getCurrencies()[0],
						})[0]
					);
				} else {
					text = strings.View_ShareProduct_MessageWithAmount;
				}
				text = text.replace('{AMOUNT}', String(batch.amount));
			} else if (!!batch.price) {
				text = strings.View_ShareProduct_MessageWithPrice;

				if (!!batch.price_tmp) {
					text = strings.View_ShareProduct_MessageWithDiscount;
					text = text.replace(
						'{TMP_PRICE}',
						batch.price_tmp.toString()
					);
				}

				text = text.replace(
					'{PRICE}',
					formatCurrency({
						amount: Number(batch.price.toFixed(2)),
						code: getCurrencies()[0],
					})[0]
				);
			}

			text = text.replace('{PRODUCT}', product.name);
			text = text.replace('{DATE}', exp_date);

			await ShareProductImageWithText({
				productId,
				title: strings.View_ShareProduct_Title,
				text,
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('User did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});
				}
		} finally {
			setIsSharing(false);
		}
	}, [product, batch, exp_date, productId]);

	const handleNavigateToDiscount = useCallback(() => {
		navigate('BatchDiscount', {
			batch_id: routeParams.batch_id,
		});
	}, [navigate, routeParams.batch_id]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const prod = await getProductById(productId);

			const b = prod.lotes.find(l => l.id === routeParams.batch_id);

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

	const navigateToPRO = useCallback(() => {
		navigate('Pro');
	}, [navigate]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<PageHeader>
				<Header title={strings.View_Batch_PageTitle} noDrawer />

				<ActionsButtonContainer>
					<ButtonPaper
						icon={() => <Icons name="create-outline" size={22} />}
						onPress={handleNaviEdit}
					>
						{strings.View_Batch_Button_Edit}
					</ButtonPaper>
				</ActionsButtonContainer>
			</PageHeader>

			{!!batch && (
				<BatchContainer>
					<BatchTitle>{batch.lote}</BatchTitle>

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

					{!userPreferences.disableAds && (
						<BannerContainer>
							<Banner
								adFor="BatchView"
								size={BannerAdSize.MEDIUM_RECTANGLE}
							/>
						</BannerContainer>
					)}

					<ProFeaturesContainer>
						{!userPreferences.isPRO && (
							<ProFeaturesText onPress={navigateToPRO}>
								{strings.Component_FastSub_Text}
							</ProFeaturesText>
						)}
						<Button
							text={
								strings.View_Batch_Button_ShareWithAnotherApps
							}
							onPress={handleShare}
							isLoading={isSharing}
							contentStyle={{ width: 250 }}
							enable={userPreferences.isPRO}
						/>

						{!!batch.price && (
							<Button
								text={strings.View_Batch_Discount_Button_Apply}
								onPress={handleNavigateToDiscount}
								contentStyle={{ marginTop: -5, width: 250 }}
								enable={userPreferences.isPRO}
							/>
						)}
					</ProFeaturesContainer>
				</BatchContainer>
			)}
		</Container>
	);
};

export default View;
