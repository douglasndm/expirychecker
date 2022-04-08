import React, { useState, useCallback, useContext } from 'react';
import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
} from '~/Functions/Product';
import { findProductByCode } from '~/Functions/Products/FindByCode';

import BarCodeReader from '~/Components/BarCodeReader';

import FillModal from '../../FillModal';

import { Icon, InputTextTip } from '../../../styles';

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
}

const Inputs: React.FC<InputsRequest> = ({
    code,
    selectedStoreId,
    setCode,
    onDuplicateProduct,
    onCompleteInfo,
}: InputsRequest) => {
    const { navigate } = useNavigation();
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

    const findProductByEAN = useCallback(
        async (ean_code: string) => {
            if (ean_code.length < 8) return;

            if (ean_code.trim() !== '' && userPreferences.isUserPremium) {
                if (getLocales()[0].languageCode === 'pt') {
                    try {
                        setIsFindingProd(true);

                        const queryWithoutLetters = ean_code
                            .replace(/\D/g, '')
                            .trim();
                        const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

                        const response = await findProductByCode(query);

                        if (response !== null) {
                            setProductFinded(true);

                            setProductNameFinded(response.name);

                            if (response.brand) {
                                setProductBrandFinded(response.brand);
                            }
                        } else {
                            setProductFinded(false);

                            setProductNameFinded(null);
                            setProductBrandFinded(null);
                        }
                    } finally {
                        setIsFindingProd(false);
                    }
                }
            } else {
                setProductFinded(false);
            }
        },
        [userPreferences.isUserPremium]
    );

    const handleCodeBlur = useCallback(
        (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            if (code) {
                findProductByEAN(code);
            }
        },
        [code, findProductByEAN]
    );

    const handleSwitchFindModal = useCallback(() => {
        setShowFillModal(!showFillModal);
    }, [showFillModal]);

    const completeInfo = useCallback(() => {
        if (productNameFinded) {
            if (productBrandFinded) {
                onCompleteInfo({
                    prodName: productNameFinded,
                    prodBrand: productBrandFinded,
                });
            } else {
                onCompleteInfo({
                    prodName: productNameFinded,
                });
            }

            setShowFillModal(false);
        }
    }, [onCompleteInfo, productBrandFinded, productNameFinded]);

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
                    <Icon name="barcode-outline" size={34} />
                </InputTextIconContainer>

                {userPreferences.isUserPremium && (
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
