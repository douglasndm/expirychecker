import React, {
    useState,
    useEffect,
    useContext,
    useCallback,
    useMemo,
} from 'react';
import { ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import EnvConfig from 'react-native-config';
import { exists, unlink } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@invertase/react-native-google-ads';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '~/Functions/Product';
import { createLote } from '~/Functions/Lotes';
import { getImageFileNameFromPath } from '~/Functions/Products/Image';

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
import { findProductByCode } from '~/Functions/Products/FindByCode';

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_PRODUCT;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

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

    const [adReady, setAdReady] = useState(false);

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
    const [showProdFindedModal, setShowProdFindedModal] =
        useState<boolean>(false);

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

                if (!userPreferences.disableAds && adReady) {
                    interstitialAd.show();
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
        adReady,
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

    useEffect(() => {
        const eventListener = interstitialAd.onAdEvent(type => {
            if (type === AdEventType.LOADED) {
                setAdReady(true);
            }
            if (type === AdEventType.CLOSED) {
                setAdReady(false);
            }
            if (type === AdEventType.ERROR) {
                setAdReady(false);
            }
        });

        // Start loading the interstitial straight away
        interstitialAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, []);

    const findProductByEAN = useCallback(async () => {
        if (code !== '' && userPreferences.isUserPremium) {
            if (getLocales()[0].languageCode === 'pt') {
                try {
                    setIsFindingProd(true);
                    const response = await findProductByCode(code);

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
    }, [code, userPreferences.isUserPremium]);

    const handleSwitchFindModal = useCallback(() => {
        setShowProdFindedModal(!showProdFindedModal);
    }, [showProdFindedModal]);

    const completeInfo = useCallback(() => {
        if (productNameFinded) {
            setName(productNameFinded);

            setShowProdFindedModal(false);
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
            await handleCheckProductCode(codeRead);
        },
        [handleCheckProductCode]
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
                                                onBlur={findProductByEAN}
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

                                            {isFindingProd && (
                                                <InputTextLoading />
                                            )}

                                            {productFinded && !isFindingProd && (
                                                <InputTextIconContainer
                                                    style={{ marginTop: -5 }}
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

                            <Dialog.Container
                                visible={showProdFindedModal}
                                onBackdropPress={handleSwitchFindModal}
                            >
                                <Dialog.Title>
                                    {
                                        strings.View_AddProduct_FillInfo_Modal_Title
                                    }
                                </Dialog.Title>
                                <Dialog.Description>
                                    {
                                        strings.View_AddProduct_FillInfo_Modal_Description
                                    }
                                </Dialog.Description>
                                <Dialog.Button
                                    label={
                                        strings.View_AddProduct_FillInfo_Modal_No
                                    }
                                    onPress={handleSwitchFindModal}
                                />
                                <Dialog.Button
                                    label={
                                        strings.View_AddProduct_FillInfo_Modal_Yes
                                    }
                                    onPress={completeInfo}
                                />
                            </Dialog.Container>
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default Add;
