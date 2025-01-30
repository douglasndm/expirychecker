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
	const [fieldError, setFieldError] = useState<boolean>(false);

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
		(name: string, brand?: string) => {
			if (brand) {
				if (BrandsPickerRef.current) {
					if (BrandsPickerRef.current.selectByName)
						BrandsPickerRef.current.selectByName(brand);
				}
			}

			onCompleteInfo({
				prodName: name,
			});
		},
		[BrandsPickerRef, onCompleteInfo]
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
						if (response.brand) {
							completeInfo(response.name, response.brand);
						} else {
							completeInfo(response.name);
						}

						await handleCheckProductCode(query);
					}
				} finally {
					setIsFindingProd(false);
				}
			}
		},
		[completeInfo, handleCheckProductCode, userPreferences.isPRO]
	);

	const handleCodeBlur = useCallback(
		(e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
			if (e.nativeEvent.text) {
				findProductByEAN(e.nativeEvent.text);
			}
		},
		[findProductByEAN]
	);

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

				{userPreferences.isPRO && isFindingProd && <InputTextLoading />}
			</InputCodeTextContainer>
			{fieldError && (
				<InputTextTip onPress={handleNavigateToExistProduct}>
					{strings.View_AddProduct_Tip_DuplicateProduct}
				</InputTextTip>
			)}
		</>
	);
});

Inputs.displayName = 'Input Code';

export default Inputs;
