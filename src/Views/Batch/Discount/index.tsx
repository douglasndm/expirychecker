import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { getLocales } from 'react-native-localize';
import { NumericFormat } from 'react-number-format';

import strings from '@shared/Locales';

import { getLoteById } from '@expirychecker/Functions/Lotes';
import { updateBatch } from '@expirychecker/Functions/Products/Batches/Batch';

import Header from '@components/Header';
import Button from '@components/Button';
import Loading from '@components/Loading';

import {
	Container,
	Content,
	BatchName,
	BatchPrice,
	SliderContent,
	TempPrice,
	Slider,
	NewPrice,
} from './styles';

interface Params {
	batch_id: number;
}

const Discount: React.FC = () => {
	const route = useRoute();
	const { pop, addListener } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const routeParams = route.params as Params;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [batch, setBatch] = useState<IBatch | null>(null);

	const [applyingDiscount, setApplyingDiscount] = useState<boolean>(false);
	const [discount, setDiscount] = useState<number>(0);
	const [newPrice, setNewPrice] = useState<number>(0);

	const currencyPrefix = useMemo(() => {
		if (getLocales()[0].languageCode === 'en') {
			return '$';
		}

		return 'R$';
	}, []);

	const handleApplyDiscount = useCallback(async () => {
		if (!batch) {
			return;
		}

		try {
			setApplyingDiscount(true);

			await updateBatch({
				...batch,
				id: routeParams.batch_id,
				price_tmp: newPrice,
			});

			showMessage({
				message: strings.View_Batch_Discount_Alert_Success,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setApplyingDiscount(false);
		}
	}, [batch, newPrice, pop, routeParams.batch_id]);

	const onSliderChange = useCallback(
		(value: number) => {
			setDiscount(value);

			if (batch && batch.price) {
				const priceAsString = String(batch.price);
				const fullPrice = Number(
					priceAsString.replace(/[^0-9.-]+/g, '')
				);

				const currentDiscount = fullPrice * value;
				setNewPrice(fullPrice - currentDiscount);
			}
		},
		[batch]
	);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);
			const b = await getLoteById(routeParams.batch_id);

			setBatch(b);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [routeParams.batch_id]);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return unsubscribe;
	}, [addListener, loadData, routeParams.batch_id]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header title={strings.View_Batch_Discount_PageTitle} noDrawer />

			{!!batch && (
				<Content>
					<BatchName>{`${strings.View_Batch_Discount_Batch_Name} ${batch.name}`}</BatchName>
					<BatchPrice>
						{`${strings.View_Batch_Discount_Batch_Price} `}
						<NumericFormat
							value={batch.price}
							displayType="text"
							thousandSeparator
							prefix={currencyPrefix}
							renderText={value => value}
							decimalScale={2}
						/>
					</BatchPrice>

					<SliderContent>
						<TempPrice>
							{strings.View_Batch_Discount_Batch_DiscountPercentage.replace(
								'{PERCENTAGE}',
								Math.round(discount * 100).toString()
							)}
						</TempPrice>

						<Slider
							minimumValue={0}
							maximumValue={1}
							onValueChange={onSliderChange}
						/>

						<NewPrice>
							{`${strings.View_Batch_Discount_Batch_DiscountedPrice} `}
							<NumericFormat
								value={newPrice}
								displayType="text"
								thousandSeparator
								prefix={currencyPrefix}
								renderText={value => value}
								decimalScale={2}
							/>
						</NewPrice>
					</SliderContent>

					<Button
						title={strings.View_Batch_Discount_Button_Apply}
						onPress={handleApplyDiscount}
						isLoading={applyingDiscount}
					/>
				</Content>
			)}
		</Container>
	);
};

export default Discount;
