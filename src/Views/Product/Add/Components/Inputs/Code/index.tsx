import React, { useState, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import * as Yup from 'yup';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	checkIfProductAlreadyExistsByCode,
	getProductByCode,
} from '@expirychecker/Functions/Product';
import { findProductByCode } from '@expirychecker/Functions/Products/FindByCode';

import BarCodeReader from '@components/BarCodeReader';

import { Icon, InputTextTip } from '@views/Product/Add/styles';

import FillModal from '../../FillModal';

import {
	InputCodeTextContainer,
	InputCodeText,
	InputTextIconContainer,
	InputTextLoading,
} from './styles';

export interface completeInfoProps {
	prodName: string;
	prodBrand?: string;
}

interface InputsRequest {
	code: string | undefined;
	selectedStoreId?: string; // for duplicate search
	setCode: (value: string) => void;
	onDuplicateProduct: () => void;
	onCompleteInfo: ({ prodName, prodBrand }: completeInfoProps) => void;
	BrandsPickerRef: React.MutableRefObject<any>;
}

const Inputs: React.FC<InputsRequest> = ({
	code,
	selectedStoreId,
	setCode,
	onDuplicateProduct,
	onCompleteInfo,
	BrandsPickerRef,
}: InputsRequest) => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();
	const { userPreferences } = useContext(PreferencesContext);

	const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

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

	const handleDisableBarCodeReader = useCallback(() => {
		setIsBarCodeEnabled(false);
	}, []);

	const enableReader = useCallback(() => {
		setIsBarCodeEnabled(true);
	}, []);

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
					setExistProdId(existProd.id);
					onDuplicateProduct();
				}
			}
		},
		[code, onDuplicateProduct, selectedStoreId]
	);

	const handleNavigateToExistProduct = useCallback(async () => {
		if (existsProdId) {
			navigate('AddLote', { productId: existsProdId });
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

			const schema = Yup.object().shape({
				ean_code: Yup.number().required().min(8),
			});

			try {
				await schema.validate({ ean_code });
			} catch (err) {
				setProductFinded(false);
				return;
			}

			if (ean_code.length < 8) return;

			if (getLocales()[0].languageCode === 'pt') {
				try {
					setIsFindingProd(true);

					const queryWithoutLetters = ean_code
						.replace(/\D/g, '')
						.trim();
					const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

					if (query === '') return;

					const response = await findProductByCode(query);

					if (response !== null) {
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

	const handleCodeBlur = useCallback(() => {
		if (code) {
			findProductByEAN(code);
		}
	}, [code, findProductByEAN]);

	const handleSwitchFindModal = useCallback(() => {
		setShowFillModal(!showFillModal);
	}, [showFillModal]);

	const handleOnCodeRead = useCallback(
		async (codeRead: string) => {
			setCode(codeRead);
			setIsBarCodeEnabled(false);
			await findProductByEAN(codeRead);
			await handleCheckProductCode(codeRead);
		},
		[findProductByEAN, handleCheckProductCode, setCode]
	);

	return isBarCodeEnabled ? (
		<BarCodeReader
			onCodeRead={handleOnCodeRead}
			onClose={handleDisableBarCodeReader}
		/>
	) : (
		<>
			<InputCodeTextContainer hasError={fieldError}>
				<InputCodeText
					placeholder={strings.View_AddProduct_InputPlacehoder_Code}
					value={code}
					onBlur={handleCodeBlur}
					onChangeText={value => {
						setCode(value);
						setFieldError(false);
					}}
				/>

				<InputTextIconContainer onPress={enableReader}>
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
								<Icon name="download" size={30} />
							</InputTextIconContainer>
						)}
					</>
				)}

				<FillModal
					onConfirm={completeInfo}
					show={showFillModal}
					setShow={setShowFillModal}
				/>
			</InputCodeTextContainer>
			{fieldError && (
				<InputTextTip onPress={handleNavigateToExistProduct}>
					{strings.View_AddProduct_Tip_DuplicateProduct}
				</InputTextTip>
			)}
		</>
	);
};

export default Inputs;
