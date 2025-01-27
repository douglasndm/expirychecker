import React, { useState, useCallback, useContext } from 'react';
import {
	NativeSyntheticEvent,
	TextInputEndEditingEventData,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	checkIfProductAlreadyExistsByCode,
	getProductByCode,
} from '@expirychecker/Functions/Product';
import { findProductByCode } from '@utils/Product/FindByEAN';

import { Icon, InputTextTip } from '@views/Product/Add/styles';

import Dialog from '@components/Dialog';
import { Input } from '@components/InputText/styles';

import {
	InputCodeTextContainer,
	InputTextIconContainer,
	InputTextLoading,
} from './styles';

export interface completeInfoProps {
	prodName: string;
	prodBrand?: string;
}

export interface InputsRequestRef {
	code: string | undefined;
	selectedStoreId?: string; // for duplicate search
	setCode: (value: string) => void;
	onDuplicateProduct: () => void;
	onCompleteInfo: ({ prodName, prodBrand }: completeInfoProps) => void;
	BrandsPickerRef: React.MutableRefObject<any>;
	onSwitchEnable: () => void;
	handleOnCodeRead: (value: string) => Promise<void>;
}

const Inputs = React.forwardRef<InputsRequestRef>((props, ref) => {
	const {
		code,
		selectedStoreId,
		setCode,
		onDuplicateProduct,
		onCompleteInfo,
		BrandsPickerRef,
		onSwitchEnable,
	} = props as InputsRequestRef;

	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();
	const { userPreferences } = useContext(PreferencesContext);

	const [existsProdId, setExistProdId] = useState<number | undefined>();

	const [isFindingProd, setIsFindingProd] = useState<boolean>(false);
	const [productFinded, setProductFinded] = useState<boolean>(false);
	const [showFillModal, setShowFillModal] = useState<boolean>(false);

	const [fieldError, setFieldError] = useState<boolean>(false);

	const [productNameFinded, setProductNameFinded] = useState<null | string>(
		null
	);
	const [productBrandFinded, setProductBrandFinded] = useState<null | string>(
		null
	);

	const handleCheckProductCode = useCallback(
		async (anotherCode?: string) => {
			let theCode;

			if (code) {
				theCode = code;
			} else if (anotherCode) {
				theCode = anotherCode;
			}

			if (theCode) {
				const prodExist = await checkIfProductAlreadyExistsByCode({
					productCode: theCode,
					productStore: selectedStoreId,
				});

				if (prodExist) {
					setFieldError(true);

					const existProd = await getProductByCode({
						productCode: theCode,
						store: selectedStoreId,
					});
					setExistProdId(Number(existProd.id));
					onDuplicateProduct();
				}
			}
		},
		[code, onDuplicateProduct, selectedStoreId]
	);

	const handleNavigateToExistProduct = useCallback(async () => {
		if (existsProdId) {
			navigate('AddBatch', { productId: existsProdId });
		}
	}, [existsProdId, navigate]);

	const completeInfo = useCallback(
		(name?: string, brand?: string) => {
			let prodName: string | undefined | null = name;

			if (typeof prodName !== 'string') {
				prodName = productNameFinded;
			}

			let prodBrand: string | undefined | null = brand;

			if (typeof prodBrand !== 'string') {
				prodBrand = productBrandFinded;
			}

			if (prodBrand && BrandsPickerRef.current) {
				if (BrandsPickerRef.current.selectByName)
					BrandsPickerRef.current.selectByName(prodBrand);
			}

			if (prodName)
				onCompleteInfo({
					prodName,
				});

			setShowFillModal(false);
		},
		[BrandsPickerRef, onCompleteInfo, productBrandFinded, productNameFinded]
	);

	const findProductByEAN = useCallback(
		async (ean_code: string) => {
			if (!userPreferences.isPRO) return;

			if (getLocales()[0].languageCode === 'pt') {
				try {
					setIsFindingProd(true);

					const queryWithoutLetters = ean_code
						.replace(/\D/g, '')
						.trim();
					const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

					if (query.length < 8) return;

					const response = await findProductByCode(query);

					if (response !== null && !!response.name) {
						setProductFinded(true);

						setProductNameFinded(response.name);

						if (response.brand) {
							setProductBrandFinded(response.brand);
						}

						if (userPreferences.autoComplete) {
							if (response.brand) {
								completeInfo(response.name, response.brand);
							} else {
								completeInfo(response.name);
							}
						}

						await handleCheckProductCode(query);
					} else {
						setProductFinded(false);

						setProductNameFinded(null);
						setProductBrandFinded(null);
					}
				} finally {
					setIsFindingProd(false);
				}
			}
		},
		[
			completeInfo,
			handleCheckProductCode,
			userPreferences.autoComplete,
			userPreferences.isPRO,
		]
	);

	const handleCodeBlur = useCallback(
		(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
			if (e.nativeEvent.text) {
				findProductByEAN(e.nativeEvent.text);
			}
		},
		[findProductByEAN]
	);

	const handleSwitchFindModal = useCallback(() => {
		setShowFillModal(prevState => !prevState);
	}, []);

	const handleOnCodeRead = useCallback(
		async (codeRead: string) => {
			await findProductByEAN(codeRead);
			await handleCheckProductCode(codeRead);
		},
		[findProductByEAN, handleCheckProductCode]
	);

	const handleOnTextChange = useCallback(
		(text: string) => {
			setCode(text);
			setFieldError(false);
		},
		[setCode]
	);

	React.useImperativeHandle(
		ref,
		() => ({
			code,
			setCode,
			onDuplicateProduct,
			onCompleteInfo,
			BrandsPickerRef,
			onSwitchEnable,
			handleOnCodeRead,
			findProductByEAN,
			handleCheckProductCode,
		}),
		[
			BrandsPickerRef,
			code,
			findProductByEAN,
			handleCheckProductCode,
			handleOnCodeRead,
			onCompleteInfo,
			onDuplicateProduct,
			onSwitchEnable,
			setCode,
		]
	);

	return (
		<>
			<InputCodeTextContainer hasError={fieldError}>
				<Input
					placeholder={strings.View_AddProduct_InputPlacehoder_Code}
					value={code}
					onEndEditing={handleCodeBlur}
					onChangeText={handleOnTextChange}
				/>

				<InputTextIconContainer onPress={onSwitchEnable}>
					<Icon name="barcode-outline" size={34} insideInput />
				</InputTextIconContainer>

				{userPreferences.isPRO && (
					<>
						{isFindingProd && <InputTextLoading />}

						{productFinded && !isFindingProd && (
							<InputTextIconContainer
								style={{
									marginTop: -5,
								}}
								onPress={handleSwitchFindModal}
							>
								<Icon name="download" size={30} insideInput />
							</InputTextIconContainer>
						)}
					</>
				)}
			</InputCodeTextContainer>
			{fieldError && (
				<InputTextTip onPress={handleNavigateToExistProduct}>
					{strings.View_AddProduct_Tip_DuplicateProduct}
				</InputTextTip>
			)}

			<Dialog
				visible={showFillModal}
				title={strings.View_AddProduct_FillInfo_Modal_Title}
				description={strings.View_AddProduct_FillInfo_Modal_Description}
				cancelText={strings.View_AddProduct_FillInfo_Modal_No}
				confirmText={strings.View_AddProduct_FillInfo_Modal_Yes}
				onConfirm={completeInfo}
				onDismiss={handleSwitchFindModal}
				onCancel={handleSwitchFindModal}
			/>
		</>
	);
});

Inputs.displayName = 'Input Code';

export default Inputs;
