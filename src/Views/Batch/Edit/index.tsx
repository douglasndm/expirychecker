import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
} from 'react';
import { Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import { Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { updateLote, deleteLote } from '@expirychecker/Functions/Lotes';
import { getProductById } from '@expirychecker/Functions/Product';

import Loading from '@components/Loading';
import Header from '@components/Header';
import ActionButton from '@components/ActionButton';
import Switch from '@components/Switch';

import {
	Container,
	PageContent,
	InputContainer,
	InputTextContainer,
	Currency,
	InputGroup,
	ExpDateGroup,
	ExpDateLabel,
	CustomDatePicker,
} from '@expirychecker/Views/Product/Add/styles';
import { InputCodeText } from '@expirychecker/Views/Product/Add/Components/Inputs/Code/styles';
import {
	CheckBoxContainer,
	CheckBoxGroupTitle,
	CheckBoxOption,
	RadioButtonGroup,
} from '@views/Batch/Edit/styles';
import { ProductHeader, ProductName, ProductCode } from '../Add/styles';

import {
	Button,
	RadioButton,
	RadioButtonText,
	ActionsButtonContainer,
	TextField,
} from './styles';

interface Props {
	productId: number;
	loteId: number;
}

const EditBatch: React.FC = () => {
	const route = useRoute();
	const { reset, navigate } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences } = useContext(PreferencesContext);

	const routeParams = route.params as Props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [locale] = useState(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'en-US';
		}
		return 'pt-BR';
	});
	const [currency] = useState(() => {
		if (getLocales()[0].languageCode === 'en') {
			return 'USD';
		}

		return 'BRL';
	});

	const [product, setProduct] = useState<IProduct | null>(null);

	const productId = useMemo(() => {
		return routeParams.productId;
	}, [routeParams]);

	const loteId = useMemo(() => {
		return routeParams.loteId;
	}, [routeParams]);

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const theme = useTheme();

	const [lote, setLote] = useState('');
	const [amount, setAmount] = useState(0);
	const [price, setPrice] = useState<number | null>(null);

	const [expDate, setExpDate] = useState(new Date());
	const [tratado, setTratado] = useState(false);

	const [whereIs, setWhereIs] = useState<'stock' | 'shelf' | null>(null);
	const [additionalData, setAdditionalData] = useState<boolean>(false);
	const [additionalDataText, setAdditionalDataText] = useState<string>('');

	useEffect(() => {
		async function getData() {
			setIsLoading(true);

			const response = await getProductById(productId);
			setProduct(response);

			if (!response) return;

			const loteResult = response.batches.find(l => l.id === loteId);

			if (!loteResult) {
				showMessage({
					message: strings.View_EditBatch_Error_BatchDidntFound,
					type: 'danger',
				});
				return;
			}

			const loteStatus = loteResult.status === 'Tratado';

			setLote(loteResult.name);
			setExpDate(loteResult.exp_date);
			setTratado(loteStatus);

			if (loteResult.amount) setAmount(loteResult.amount);
			if (loteResult.price) setPrice(loteResult.price);
			if (loteResult.where_is) setWhereIs(loteResult.where_is);
			if (loteResult.additional_data) {
				setAdditionalData(true);
				setAdditionalDataText(loteResult.additional_data);
			}
			setIsLoading(false);
		}

		getData();
	}, [productId, loteId]);

	const handleSave = useCallback(async () => {
		if (!product) return;

		try {
			const { isPRO } = userPreferences;
			const moreData = isPRO && additionalData;

			await updateLote(
				{
					id: loteId,
					name: lote,
					amount: Number(amount),
					exp_date: expDate,
					price: price || undefined,
					status: tratado ? 'Tratado' : 'Não tratado',
					where_is: isPRO ? whereIs : null,
					additional_data: moreData ? additionalDataText : null,
				},
				product
			);

			if (isPRO) {
				navigate('ProductDetails', {
					id: productId,
				});

				showMessage({
					message: strings.View_Success_BatchUpdatedDescription,
					type: 'info',
				});
			} else {
				navigate('Success', {
					productId,
					type: 'edit_batch',
				});
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [
		additionalData,
		additionalDataText,
		amount,
		expDate,
		lote,
		loteId,
		navigate,
		price,
		product,
		productId,
		tratado,
		userPreferences,
		whereIs,
	]);

	const handleDelete = useCallback(async () => {
		if (!product) return;
		try {
			await deleteLote(loteId, product);

			if (userPreferences.isPRO) {
				reset({
					index: 1,
					routes: [
						{ name: 'Home' },
						{ name: 'ProductDetails', params: { id: productId } },
					],
				});

				showMessage({
					message: strings.View_Success_BatchDeletedDescription,
					type: 'info',
				});
			} else {
				reset({
					index: 1,
					routes: [
						{ name: 'Home' },
						{ name: 'Success', params: { type: 'delete_batch' } },
					],
				});
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [loteId, product, productId, reset, userPreferences.isPRO]);

	const handleAmountChange = useCallback(value => {
		const regex = /^[0-9\b]+$/;

		if (value === '' || regex.test(value)) {
			setAmount(value);
		}
	}, []);

	const handlePriceChange = useCallback((value: number) => {
		if (value <= 0) {
			setPrice(null);
			return;
		}
		setPrice(value);
	}, []);

	return isLoading ? (
		<Loading />
	) : (
		<>
			<Container>
				<PageContent>
					<Header title={strings.View_EditBatch_PageTitle} noDrawer />

					<InputContainer>
						<ProductHeader>
							{!!product && (
								<ProductName>{product.name}</ProductName>
							)}
							{!!product && !!product.code && (
								<ProductCode>{product.code}</ProductCode>
							)}
						</ProductHeader>

						<InputGroup>
							<InputTextContainer
								style={{
									flex: 5,
									marginRight: 5,
								}}
							>
								<InputCodeText
									placeholder={
										strings.View_EditBatch_InputPlacehoder_Batch
									}
									value={lote}
									onChangeText={(value: string) =>
										setLote(value)
									}
								/>
							</InputTextContainer>
							<InputTextContainer
								style={{
									flex: 4,
								}}
							>
								<InputCodeText
									placeholder={
										strings.View_EditBatch_InputPlacehoder_Amount
									}
									keyboardType="numeric"
									value={String(amount)}
									onChangeText={handleAmountChange}
								/>
							</InputTextContainer>
						</InputGroup>

						<Currency
							value={price}
							onChangeValue={handlePriceChange}
							delimiter={currency === 'BRL' ? ',' : '.'}
							placeholder={
								strings.View_EditBatch_InputPlacehoder_UnitPrice
							}
						/>

						<RadioButtonGroup>
							<CheckBoxContainer>
								<CheckBoxGroupTitle>
									{strings.View_EditBatch_Status}
								</CheckBoxGroupTitle>
								<CheckBoxOption>
									<RadioButtonText>
										{
											strings.View_EditBatch_RadioButton_Treated
										}
									</RadioButtonText>
									<RadioButton
										value="tratado"
										status={
											tratado === true
												? 'checked'
												: 'unchecked'
										}
										onPress={() => setTratado(true)}
									/>
								</CheckBoxOption>
								<CheckBoxOption>
									<RadioButtonText>
										{
											strings.View_EditBatch_RadioButton_NotTreated
										}
									</RadioButtonText>
									<RadioButton
										value="Não tratado"
										status={
											tratado === !true
												? 'checked'
												: 'unchecked'
										}
										onPress={() => setTratado(false)}
									/>
								</CheckBoxOption>
							</CheckBoxContainer>

							{userPreferences.isPRO && (
								<>
									<CheckBoxContainer>
										<CheckBoxGroupTitle>
											{strings.View_Batch_WhereIs}
										</CheckBoxGroupTitle>
										<CheckBoxOption>
											<RadioButtonText>
												{
													strings.View_Batch_WhereIs_Shelf
												}
											</RadioButtonText>
											<RadioButton
												status={
													whereIs === 'shelf'
														? 'checked'
														: 'unchecked'
												}
												onPress={() => {
													if (whereIs === 'shelf') {
														setWhereIs(null);
													} else {
														setWhereIs('shelf');
													}
												}}
											/>
										</CheckBoxOption>

										<CheckBoxOption>
											<RadioButtonText>
												{
													strings.View_Batch_WhereIs_Stock
												}
											</RadioButtonText>
											<RadioButton
												status={
													whereIs === 'stock'
														? 'checked'
														: 'unchecked'
												}
												onPress={() => {
													if (whereIs === 'stock') {
														setWhereIs(null);
													} else {
														setWhereIs('stock');
													}
												}}
											/>
										</CheckBoxOption>
									</CheckBoxContainer>
								</>
							)}
						</RadioButtonGroup>

						<Switch
							text={strings.View_Batch_ExtraInfo}
							value={additionalData}
							onValueChange={() =>
								setAdditionalData(!additionalData)
							}
						/>

						{additionalData && (
							<TextField
								placeholder="Dados adicionais para o produto"
								value={additionalDataText}
								onChangeText={(value: string) =>
									setAdditionalDataText(value)
								}
							/>
						)}

						<ExpDateGroup>
							<ExpDateLabel>
								{strings.View_EditBatch_CalendarTitle}
							</ExpDateLabel>
							<CustomDatePicker
								date={expDate}
								onDateChange={(value: Date) => {
									setExpDate(value);
								}}
								locale={locale}
							/>
						</ExpDateGroup>
					</InputContainer>

					<ActionsButtonContainer>
						<ActionButton
							text={strings.View_EditBatch_Button_Save}
							iconName="save-outline"
							onPress={handleSave}
						/>
						<ActionButton
							text={strings.View_EditBatch_Button_DeleteBatch}
							iconName="trash-outline"
							onPress={() => {
								setDeleteComponentVisible(true);
							}}
						/>
					</ActionsButtonContainer>
				</PageContent>
			</Container>

			<Dialog
				visible={deleteComponentVisible}
				onDismiss={() => {
					setDeleteComponentVisible(false);
				}}
				style={{ backgroundColor: theme.colors.productBackground }}
			>
				<Dialog.Title style={{ color: theme.colors.productCardText }}>
					{strings.View_EditBatch_WarningDelete_Title}
				</Dialog.Title>
				<Dialog.Content>
					<Text style={{ color: theme.colors.productCardText }}>
						{strings.View_EditBatch_WarningDelete_Message}
					</Text>
				</Dialog.Content>
				<Dialog.Actions>
					<Button onPress={handleDelete}>
						{strings.View_EditBatch_WarningDelete_Button_Confirm}
					</Button>
					<Button
						onPress={() => {
							setDeleteComponentVisible(false);
						}}
					>
						{strings.View_EditBatch_WarningDelete_Button_Cancel}
					</Button>
				</Dialog.Actions>
			</Dialog>
		</>
	);
};

export default EditBatch;
