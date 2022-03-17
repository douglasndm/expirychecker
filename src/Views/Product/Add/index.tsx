import React, {
    useState,
    useContext,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import {
    NativeSyntheticEvent,
    ScrollView,
    TextInputFocusEventData,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { exists, unlink } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '~/Functions/Product';
import { createLote } from '~/Functions/Lotes';
import { getImageFileNameFromPath } from '~/Functions/Products/Image';
import { findProductByCode } from '~/Functions/Products/FindByCode';

import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';

import DaysToBeNext from '~/Components/Product/Inputs/DaysToBeNext';
import BrandSelect from '~/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '~/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '~/Components/Product/Inputs/Pickers/Store';

import FillModal from './Components/FillModal';
import Interstitial, { IInterstitialRef } from './Components/Interstitial';

import {
    Container,
    PageContent,
    ProductImageContainer,
    ProductImage,
    InputContainer,
    InputTextContainer,
    InputTextTip,
    CameraButtonContainer,
    Currency,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    InputTextIconContainer,
    ImageContainer,
    InputTextLoading,
    Icon,
    InputCodeTextContainer,
    InputCodeText,
} from './styles';

interface Request {
    route: {
        params: {
            store?: string;
            brand?: string;
            category?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { navigate } = useNavigation();
    const InterstitialRef = useRef<IInterstitialRef>();

    const locale = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'en-US';
        }
        return 'pt-BR';
    }, []);
    const currency = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'USD';
        }

        return 'BRL';
    }, []);

    const { userPreferences } = useContext(PreferencesContext);

    const [showFillModal, setShowFillModal] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photoPath, setPhotoPath] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState<number | null>(null);
    const [expDate, setExpDate] = useState(new Date());

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        () => {
            if (route.params && route.params.category) {
                return route.params.category;
            }
            return null;
        }
    );

    const [selectedBrand, setSelectedBrand] = useState<string | null>(() => {
        if (route.params && route.params.brand) {
            return route.params.brand;
        }
        return null;
    });
    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (route.params && route.params.store) {
            return route.params.store;
        }
        return null;
    });

    const [daysNext, setDaysNext] = useState<number | undefined>();

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [existentProduct, setExistentProduct] = useState<number | null>(null);

    const [isFindingProd, setIsFindingProd] = useState<boolean>(false);
    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const [productFinded, setProductFinded] = useState<boolean>(false);
    const [productNameFinded, setProductNameFinded] = useState<null | string>(
        null
    );

    const handleSave = useCallback(async () => {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        if (nameFieldError || codeFieldError) {
            return;
        }
        try {
            const picFileName = getImageFileNameFromPath(photoPath);

            const prodCategories: Array<string> = [];

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategories.push(selectedCategory);
            }

            const tempBrand =
                selectedBrand && selectedBrand !== 'null'
                    ? selectedBrand
                    : undefined;

            const tempStore =
                selectedStore && selectedStore !== 'null'
                    ? selectedStore
                    : undefined;

            const newProduct: Omit<IProduct, 'id'> = {
                name,
                code,
                brand: tempBrand,
                store: tempStore,
                photo: picFileName,
                daysToBeNext: daysNext,
                categories: prodCategories,
                lotes: [],
            };

            const newLote: Omit<ILote, 'id'> = {
                lote,
                exp_date: expDate,
                amount: Number(amount),
                price: price || undefined,
                status: 'Não tratado',
            };

            const productCreatedId = await createProduct({
                product: newProduct,
            });

            if (productCreatedId) {
                await createLote({
                    lote: newLote,
                    productId: productCreatedId,
                });

                if (!userPreferences.disableAds) {
                    if (InterstitialRef.current) {
                        InterstitialRef.current.showInterstitial();
                    }
                }

                navigate('Success', {
                    type: 'create_product',
                    productId: productCreatedId,

                    category_id: selectedCategory,
                    store_id: selectedStore,
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
        amount,
        code,
        codeFieldError,
        daysNext,
        expDate,
        lote,
        name,
        nameFieldError,
        navigate,
        photoPath,
        price,
        selectedBrand,
        selectedCategory,
        selectedStore,
        userPreferences.disableAds,
    ]);

    const findProductByEAN = useCallback(
        async (ean_code: string) => {
            if (ean_code.length < 8) return;

            if (ean_code !== '' && userPreferences.isUserPremium) {
                if (getLocales()[0].languageCode === 'pt') {
                    try {
                        setIsFindingProd(true);
                        const response = await findProductByCode(ean_code);

                        if (response !== null) {
                            setProductFinded(true);

                            setProductNameFinded(response.name);
                        } else {
                            setProductFinded(false);

                            setProductNameFinded(null);
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
            setName(productNameFinded);

            setShowFillModal(false);
        }
    }, [productNameFinded]);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleEnableCamera = useCallback(async () => {
        if (!userPreferences.isUserPremium) {
            navigate('Pro');
            return;
        }

        if (photoPath) {
            if (await exists(photoPath)) {
                await unlink(photoPath);
                setPhotoPath('');
            }
        }
        setIsBarCodeEnabled(false);
        setIsCameraEnabled(true);
    }, [photoPath, navigate, userPreferences.isUserPremium]);

    const handleDisableCamera = useCallback(() => {
        setIsCameraEnabled(false);
    }, []);

    const handleEnableBarCodeReader = useCallback(() => {
        setIsCameraEnabled(false);
        setIsBarCodeEnabled(true);
    }, []);

    const handleDisableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(false);
    }, []);

    const onPhotoTaked = useCallback(
        async ({ filePath }: onPhotoTakedProps) => {
            if (await exists(filePath)) {
                setPhotoPath(filePath);
            }

            handleDisableCamera();
        },
        [handleDisableCamera]
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
                    productStore: selectedStore || undefined,
                });

                if (prodExist) {
                    setCodeFieldError(true);

                    const existProd = await getProductByCode({
                        productCode: theCode,
                        store: selectedStore || undefined,
                    });
                    setExistentProduct(existProd.id);
                }
            }
        },
        [code, selectedStore]
    );

    const handleNavigateToExistProduct = useCallback(async () => {
        if (existentProduct) {
            navigate('AddLote', { productId: existentProduct });
        }
    }, [existentProduct, navigate]);

    const handleOnCodeRead = useCallback(
        async (codeRead: string) => {
            setCode(codeRead);
            setIsBarCodeEnabled(false);
            await findProductByEAN(codeRead);
            await handleCheckProductCode(codeRead);
        },
        [findProductByEAN, handleCheckProductCode]
    );

    const handleNameChange = useCallback((value: string) => {
        setName(value);
        setNameFieldError(false);
    }, []);

    const handlePriceChange = useCallback((value: number) => {
        if (value <= 0) {
            setPrice(null);
            return;
        }
        setPrice(value);
    }, []);

    return (
        <>
            {isCameraEnabled ? (
                <Camera
                    onPhotoTaked={onPhotoTaked}
                    onBackButtonPressed={handleDisableCamera}
                />
            ) : (
                <>
                    {isBarCodeEnabled ? (
                        <BarCodeReader
                            onCodeRead={handleOnCodeRead}
                            onClose={handleDisableBarCodeReader}
                        />
                    ) : (
                        <Container>
                            <Interstitial ref={InterstitialRef} />
                            <ScrollView>
                                <Header
                                    title={strings.View_AddProduct_PageTitle}
                                    noDrawer
                                />
                                <StatusBar />
                                <PageContent>
                                    {userPreferences.isUserPremium &&
                                        !!photoPath && (
                                            <ImageContainer>
                                                <ProductImageContainer
                                                    onPress={handleEnableCamera}
                                                >
                                                    <ProductImage
                                                        source={{
                                                            uri: `file://${photoPath}`,
                                                        }}
                                                    />
                                                </ProductImageContainer>
                                            </ImageContainer>
                                        )}

                                    <InputContainer>
                                        <InputGroup>
                                            <InputTextContainer
                                                hasError={nameFieldError}
                                            >
                                                <Input
                                                    placeholder={
                                                        strings.View_AddProduct_InputPlacehoder_Name
                                                    }
                                                    value={name}
                                                    onChange={handleNameChange}
                                                />
                                            </InputTextContainer>

                                            <CameraButtonContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <Icon
                                                    name="camera-outline"
                                                    size={36}
                                                />
                                            </CameraButtonContainer>
                                        </InputGroup>
                                        {nameFieldError && (
                                            <InputTextTip>
                                                {
                                                    strings.View_AddProduct_AlertTypeProductName
                                                }
                                            </InputTextTip>
                                        )}

                                        <InputCodeTextContainer
                                            hasError={codeFieldError}
                                        >
                                            <InputCodeText
                                                placeholder={
                                                    strings.View_AddProduct_InputPlacehoder_Code
                                                }
                                                value={code}
                                                onBlur={handleCodeBlur}
                                                onChangeText={value => {
                                                    setCode(value);
                                                    setCodeFieldError(false);
                                                }}
                                            />

                                            <InputTextIconContainer
                                                onPress={
                                                    handleEnableBarCodeReader
                                                }
                                            >
                                                <Icon
                                                    name="barcode-outline"
                                                    size={34}
                                                />
                                            </InputTextIconContainer>

                                            {userPreferences.isUserPremium && (
                                                <>
                                                    {isFindingProd && (
                                                        <InputTextLoading />
                                                    )}

                                                    {productFinded &&
                                                        !isFindingProd && (
                                                            <InputTextIconContainer
                                                                style={{
                                                                    marginTop:
                                                                        -5,
                                                                }}
                                                                onPress={
                                                                    handleSwitchFindModal
                                                                }
                                                            >
                                                                <Icon
                                                                    name="download"
                                                                    size={30}
                                                                />
                                                            </InputTextIconContainer>
                                                        )}
                                                </>
                                            )}
                                        </InputCodeTextContainer>

                                        {codeFieldError && (
                                            <InputTextTip
                                                onPress={
                                                    handleNavigateToExistProduct
                                                }
                                            >
                                                {
                                                    strings.View_AddProduct_Tip_DuplicateProduct
                                                }
                                            </InputTextTip>
                                        )}

                                        <MoreInformationsContainer>
                                            <MoreInformationsTitle>
                                                {
                                                    strings.View_AddProduct_MoreInformation_Label
                                                }
                                            </MoreInformationsTitle>

                                            <InputGroup>
                                                <Input
                                                    contentStyle={{
                                                        flex: 5,
                                                        marginRight: 10,
                                                    }}
                                                    placeholder={
                                                        strings.View_AddProduct_InputPlacehoder_Batch
                                                    }
                                                    value={lote}
                                                    onChange={value =>
                                                        setLote(value)
                                                    }
                                                />

                                                <Input
                                                    contentStyle={{
                                                        flex: 4,
                                                    }}
                                                    placeholder={
                                                        strings.View_AddProduct_InputPlacehoder_Amount
                                                    }
                                                    keyboardType="numeric"
                                                    value={String(amount)}
                                                    onChange={
                                                        handleAmountChange
                                                    }
                                                />
                                            </InputGroup>

                                            <Currency
                                                value={price}
                                                onChangeValue={
                                                    handlePriceChange
                                                }
                                                delimiter={
                                                    currency === 'BRL'
                                                        ? ','
                                                        : '.'
                                                }
                                                placeholder={
                                                    strings.View_AddProduct_InputPlacehoder_UnitPrice
                                                }
                                            />

                                            {userPreferences.isUserPremium && (
                                                <>
                                                    <DaysToBeNext
                                                        onChange={setDaysNext}
                                                    />

                                                    <CategorySelect
                                                        onChange={
                                                            setSelectedCategory
                                                        }
                                                        defaultValue={
                                                            selectedCategory
                                                        }
                                                        containerStyle={{
                                                            marginBottom: 10,
                                                        }}
                                                    />

                                                    <BrandSelect
                                                        onChange={
                                                            setSelectedBrand
                                                        }
                                                        defaultValue={
                                                            selectedBrand
                                                        }
                                                        containerStyle={{
                                                            marginBottom: 10,
                                                        }}
                                                    />
                                                </>
                                            )}

                                            {userPreferences.multiplesStores && (
                                                <StoreSelect
                                                    defaultValue={selectedStore}
                                                    onChange={setSelectedStore}
                                                />
                                            )}
                                        </MoreInformationsContainer>

                                        <ExpDateGroup>
                                            <ExpDateLabel>
                                                {
                                                    strings.View_AddProduct_CalendarTitle
                                                }
                                            </ExpDateLabel>

                                            <CustomDatePicker
                                                accessibilityLabel={
                                                    strings.View_AddProduct_CalendarAccessibilityDescription
                                                }
                                                date={expDate}
                                                onDateChange={value => {
                                                    setExpDate(value);
                                                }}
                                                locale={locale}
                                            />
                                        </ExpDateGroup>
                                    </InputContainer>

                                    <GenericButton
                                        text={
                                            strings.View_AddProduct_Button_Save
                                        }
                                        onPress={handleSave}
                                    />
                                </PageContent>
                            </ScrollView>
                        </Container>
                    )}
                    <FillModal
                        onConfirm={completeInfo}
                        show={showFillModal}
                        setShow={setShowFillModal}
                    />
                </>
            )}
        </>
    );
};

export default Add;
