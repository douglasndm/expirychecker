import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
} from 'react';
import { View, Text } from 'react-native';
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
import { ProductHeader, ProductName, ProductCode } from '../Add/styles';

import {
	PageHeader,
	Button,
	RadioButton,
	RadioButtonText,
	ActionsButtonContainer,
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
			setIsLoading(false);
		}

		getData();
	}, [productId, loteId]);

	async function handleSave() {
		if (!product) return;

		try {
			await updateLote(
				{
					id: loteId,
					name: lote,
					amount: Number(amount),
					exp_date: expDate,
					price: price || undefined,
					status: tratado ? 'Tratado' : 'Não tratado',
				},
				product
			);

			if (userPreferences.isPRO) {
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
	}

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
					<PageHeader>
						<Header
							title={strings.View_EditBatch_PageTitle}
							noDrawer
						/>
					</PageHeader>

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
									onChangeText={value => setLote(value)}
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

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<RadioButton
									value="tratado"
									status={
										tratado === true
											? 'checked'
											: 'unchecked'
									}
									onPress={() => setTratado(true)}
								/>
								<RadioButtonText>
									{strings.View_EditBatch_RadioButton_Treated}
								</RadioButtonText>
							</View>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<RadioButton
									value="Não tratado"
									status={
										tratado === !true
											? 'checked'
											: 'unchecked'
									}
									onPress={() => setTratado(false)}
								/>
								<RadioButtonText>
									{
										strings.View_EditBatch_RadioButton_NotTreated
									}
								</RadioButtonText>
							</View>
						</View>

						<ExpDateGroup>
							<ExpDateLabel>
								{strings.View_EditBatch_CalendarTitle}
							</ExpDateLabel>
							<CustomDatePicker
								date={expDate}
								onDateChange={value => {
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
				<Dialog.Title style={{ color: theme.colors.text }}>
					{strings.View_EditBatch_WarningDelete_Title}
				</Dialog.Title>
				<Dialog.Content>
					<Text style={{ color: theme.colors.text }}>
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
