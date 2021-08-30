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
} from '@react-native-firebase/admob';

import strings from '~/Locales';

import { getAllStores } from '~/Functions/Stores';
import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '~/Functions/Product';
import { createLote } from '~/Functions/Lotes';
import { getAllCategories } from '~/Functions/Category';
import { getImageFileNameFromPath } from '~/Functions/Products/Image';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    ProductImageContainer,
    ProductImage,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    CameraButtonContainer,
    CameraButtonIcon,
    Currency,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    PickerContainer,
    Picker,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
    BannerContainer,
    BannerText,
    Icons,
} from './styles';

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_PRODUCT;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

interface ICategoryItem {
    label: string;
    value: string;
    key: string;
}
interface IStoreItem {
    label: string;
    value: string;
    key: string;
}

interface Request {
    route: {
        params: {
            store?: string;
            category?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { goBack, navigate } = useNavigation();

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
    const [selectedStore, setSelectedStore] = useState<string | null>(() => {
        if (route.params && route.params.store) {
            return route.params.store;
        }
        return null;
    });

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);
    const [stores, setStores] = useState<Array<IStoreItem>>([]);

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [existentProduct, setExistentProduct] = useState<number | null>(null);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

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

            const tempStore =
                selectedStore && selectedStore !== 'null'
                    ? selectedStore
                    : undefined;

            const newProduct: Omit<IProduct, 'id'> = {
                name,
                code,
                store: tempStore,
                photo: picFileName,
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

                if (!userPreferences.isUserPremium && adReady) {
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
        expDate,
        lote,
        name,
        nameFieldError,
        navigate,
        photoPath,
        price,
        selectedCategory,
        selectedStore,
        userPreferences.isUserPremium,
    ]);

    useEffect(() => {
        getAllCategories().then(allCategories => {
            const categoriesArray: Array<ICategoryItem> = [];

            allCategories.forEach(cat =>
                categoriesArray.push({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                })
            );

            setCategories(categoriesArray);
        });

        getAllStores().then(allStores => {
            const storesArray: Array<IStoreItem> = [];

            allStores.forEach(sto => {
                if (sto.id) {
                    storesArray.push({
                        key: sto.id,
                        label: sto.name,
                        value: sto.id,
                    });
                }
            });

            // storesArray.push({
            //     key: 'newStore',
            //     label: 'Create new store',
            //     value: 'newStore',
            // });

            setStores(storesArray);
        });
    }, []);

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

    const handleCategoryChange = useCallback(value => {
        setSelectedCategory(value);
    }, []);

    const handleStoreChange = useCallback(value => {
        setSelectedStore(value);
    }, []);

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

                    const existProd = await getProductByCode(
                        theCode,
                        selectedStore || undefined
                    );
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

    const handleNavigateToPro = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const handleOnCodeRead = useCallback(
        async (codeRead: string) => {
            setCode(codeRead);
            setIsBarCodeEnabled(false);
            await handleCheckProductCode(codeRead);
        },
        [handleCheckProductCode]
    );

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
                <Camera onPhotoTaked={onPhotoTaked} />
            ) : (
                <>
                    {isBarCodeEnabled ? (
                        <BarCodeReader
                            onCodeRead={handleOnCodeRead}
                            onClose={handleDisableBarCodeReader}
                        />
                    ) : (
                        <Container>
                            <StatusBar />
                            <ScrollView>
                                <PageHeader>
                                    <BackButton handleOnPress={goBack} />
                                    <PageTitle>
                                        {strings.View_AddProduct_PageTitle}
                                    </PageTitle>
                                </PageHeader>

                                <PageContent>
                                    {userPreferences.isUserPremium &&
                                        !!photoPath && (
                                            <ProductImageContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <ProductImage
                                                    source={{
                                                        uri: `file://${photoPath}`,
                                                    }}
                                                />
                                            </ProductImageContainer>
                                        )}

                                    <InputContainer>
                                        {!userPreferences.isUserPremium && (
                                            <BannerContainer
                                                onPress={handleNavigateToPro}
                                            >
                                                <BannerText>
                                                    {
                                                        strings.View_AddProduct_Banner_UnlockCamera
                                                    }
                                                </BannerText>

                                                <Icons name="arrow-down-outline" />
                                            </BannerContainer>
                                        )}

                                        <InputGroup>
                                            <InputTextContainer
                                                hasError={nameFieldError}
                                            >
                                                <InputText
                                                    placeholder={
                                                        strings.View_AddProduct_InputPlacehoder_Name
                                                    }
                                                    accessibilityLabel={
                                                        strings.View_AddProduct_InputAccessibility_Name
                                                    }
                                                    value={name}
                                                    onChangeText={value => {
                                                        setName(value);
                                                        setNameFieldError(
                                                            false
                                                        );
                                                    }}
                                                    onFocus={() => {
                                                        setIsBarCodeEnabled(
                                                            false
                                                        );
                                                    }}
                                                />
                                            </InputTextContainer>

                                            <CameraButtonContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <CameraButtonIcon />
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
                                                accessibilityLabel={
                                                    strings.View_AddProduct_InputAccessibility_Code
                                                }
                                                value={code}
                                                onChangeText={value => {
                                                    setCode(value);
                                                    setCodeFieldError(false);
                                                }}
                                                onBlur={handleCheckProductCode}
                                            />
                                            <InputTextIconContainer
                                                onPress={
                                                    handleEnableBarCodeReader
                                                }
                                            >
                                                <InputCodeTextIcon />
                                            </InputTextIconContainer>
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
                                                <InputTextContainer
                                                    style={{
                                                        flex: 5,
                                                        marginRight: 10,
                                                    }}
                                                >
                                                    <InputText
                                                        placeholder={
                                                            strings.View_AddProduct_InputPlacehoder_Batch
                                                        }
                                                        accessibilityLabel={
                                                            strings.View_AddProduct_InputAccessibility_Batch
                                                        }
                                                        value={lote}
                                                        onChangeText={value =>
                                                            setLote(value)
                                                        }
                                                        onFocus={() => {
                                                            setIsBarCodeEnabled(
                                                                false
                                                            );
                                                        }}
                                                    />
                                                </InputTextContainer>
                                                <InputTextContainer>
                                                    <InputText
                                                        style={{
                                                            flex: 4,
                                                        }}
                                                        placeholder={
                                                            strings.View_AddProduct_InputPlacehoder_Amount
                                                        }
                                                        accessibilityLabel={
                                                            strings.View_AddProduct_InputAccessibility_Amount
                                                        }
                                                        keyboardType="numeric"
                                                        value={String(amount)}
                                                        onChangeText={
                                                            handleAmountChange
                                                        }
                                                        onFocus={() => {
                                                            setIsBarCodeEnabled(
                                                                false
                                                            );
                                                        }}
                                                    />
                                                </InputTextContainer>
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
                                                <PickerContainer
                                                    style={{ marginBottom: 10 }}
                                                >
                                                    <Picker
                                                        items={categories}
                                                        onValueChange={
                                                            handleCategoryChange
                                                        }
                                                        value={selectedCategory}
                                                        placeholder={{
                                                            label: strings.View_AddProduct_InputPlaceholder_SelectCategory,
                                                            value: 'null',
                                                        }}
                                                    />
                                                </PickerContainer>
                                            )}

                                            {userPreferences.multiplesStores && (
                                                <PickerContainer
                                                    style={{
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    <Picker
                                                        items={stores}
                                                        onValueChange={
                                                            handleStoreChange
                                                        }
                                                        value={selectedStore}
                                                        placeholder={{
                                                            label: strings.View_AddProduct_InputPlacehoder_Store,
                                                            value: 'null',
                                                        }}
                                                    />
                                                </PickerContainer>
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
                </>
            )}
        </>
    );
};

export default Add;
