import React, {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useContext,
} from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { captureException } from '@services/ExceptionsHandler';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getProductById } from '@expirychecker/Utils/Products/Product/Get';

import { updateLote, deleteLote } from '@expirychecker/Functions/Lotes';

import Loading from '@components/Loading';
import Header from '@components/Header';
import Switch from '@components/Switch';
import Dialog from '@components/Dialog';

import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';
import {
	Container,
	PageContent,
	InputContainer,
	InputGroup,
} from '@views/Product/Add/styles';
import {
	CheckBoxContainer,
	CheckBoxGroupTitle,
	CheckBoxOption,
	RadioButtonGroup,
} from '@views/Batch/Edit/styles';
import { ProductHeader, ProductName, ProductCode } from '../Add/styles';

import { RadioButton, RadioButtonText, TextField } from './styles';

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

	const [product, setProduct] = useState<IProduct | null>(null);

	const productId = useMemo(() => {
		return routeParams.productId;
	}, [routeParams]);

	const loteId = useMemo(() => {
		return routeParams.loteId;
	}, [routeParams]);

	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

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
			if (err instanceof Error) {
				captureException({ error: err, showAlert: true });
			}
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
			if (err instanceof Error) {
				captureException({ error: err, showAlert: true });
			}
		}
	}, [loteId, product, productId, reset, userPreferences.isPRO]);

	const switchShowDeleteModal = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_EditBatch_PageTitle}
				noDrawer
				appBarActions={
					isLoading
						? []
						: [
								{
									icon: 'content-save-outline',
									onPress: handleSave,
								},
						  ]
				}
				moreMenuItems={
					isLoading
						? []
						: [
								{
									title: strings.View_ProductDetails_Button_DeleteProduct,
									leadingIcon: 'trash-can-outline',
									onPress: switchShowDeleteModal,
								},
						  ]
				}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<PageContent>
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
							<ProductBatch batch={lote} setBatch={setLote} />
							<ProductCount
								amount={amount}
								setAmount={setAmount}
							/>
						</InputGroup>

						<BatchPrice price={price} setPrice={setPrice} />

						<RadioButtonGroup>
							<CheckBoxContainer>
								<CheckBoxGroupTitle>
									{strings.baseApp.View_EditBatch_Status}
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
											{strings.baseApp.View_Batch_WhereIs}
										</CheckBoxGroupTitle>
										<CheckBoxOption>
											<RadioButtonText>
												{
													strings.baseApp
														.View_Batch_WhereIs_Shelf
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
													strings.baseApp
														.View_Batch_WhereIs_Stock
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

						{userPreferences.isPRO && (
							<>
								<Switch
									text={strings.baseApp.View_Batch_ExtraInfo}
									value={additionalData}
									onValueChange={() =>
										setAdditionalData(!additionalData)
									}
								/>

								{additionalData && (
									<TextField
										placeholder={
											strings.baseApp.View_Batch_ExtraInfo
										}
										value={additionalDataText}
										onChangeText={(value: string) =>
											setAdditionalDataText(value)
										}
									/>
								)}
							</>
						)}

						<BatchExpDate
							expDate={expDate}
							setExpDate={setExpDate}
						/>
					</InputContainer>
				</PageContent>
			)}

			<Dialog
				visible={deleteComponentVisible}
				onDismiss={switchShowDeleteModal}
				onCancel={switchShowDeleteModal}
				onConfirm={handleDelete}
				critical="Confirm"
				title={strings.View_EditBatch_WarningDelete_Title}
				description={strings.View_EditBatch_WarningDelete_Message}
				confirmText={
					strings.View_EditBatch_WarningDelete_Button_Confirm
				}
				cancelText={strings.View_EditBatch_WarningDelete_Button_Cancel}
			/>
		</Container>
	);
};

export default EditBatch;
