import React, {
    useState,
    useContext,
    useCallback,
    useMemo,
    useRef,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLocales } from 'react-native-localize';
import { exists, unlink } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { createProduct } from '~/Functions/Product';
import { createLote } from '~/Functions/Lotes';
import { getImageFileNameFromPath } from '~/Functions/Products/Image';

import Header from '~/Components/Header';
import Input from '~/Components/InputText';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';

import DaysToBeNext from '~/Components/Product/Inputs/DaysToBeNext';
import BrandSelect, {
    IBrandPickerRef,
} from '~/Components/Product/Inputs/Pickers/Brand';
import CategorySelect from '~/Components/Product/Inputs/Pickers/Category';
import StoreSelect from '~/Components/Product/Inputs/Pickers/Store';
import PaddingComponent from '~/Components/PaddingComponent';

import InputCode, { completeInfoProps } from './Components/Inputs/Code';
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
    ImageContainer,
    Icon,
} from './styles';

interface Request {
    route: {
        params: {
            brand?: string;
            category?: string;
            code?: string;
            store?: string;
        };
    };
}

const Add: React.FC<Request> = ({ route }: Request) => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const InterstitialRef = useRef<IInterstitialRef>();
    const BrandsPickerRef = useRef<IBrandPickerRef>();

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

    const [name, setName] = useState('');
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
    const [code, setCode] = useState<string | undefined>(() => {
        if (route.params && route.params.code) {
            return route.params.code;
        }
        return '';
    });

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

    const [existentProduct, setExistentProduct] = useState<boolean>(false);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);

    const handleSave = useCallback(async () => {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        if (nameFieldError || existentProduct) {
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

                    category_id: selectedCategory || undefined,
                    store_id: selectedStore || undefined,
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
        daysNext,
        existentProduct,
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

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleEnableCamera = useCallback(async () => {
        if (!userPreferences.isPRO) {
            navigate('Pro');
            return;
        }

        if (photoPath) {
            if (await exists(photoPath)) {
                await unlink(photoPath);
                setPhotoPath('');
            }
        }
        setIsCameraEnabled(true);
    }, [photoPath, navigate, userPreferences.isPRO]);

    const handleDisableCamera = useCallback(() => {
        setIsCameraEnabled(false);
    }, []);

    const handleDuplicate = useCallback(() => {
        setExistentProduct(true);
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

    const onCompleteInfo = useCallback(
        ({ prodName, prodBrand }: completeInfoProps) => {
            setName(prodName);

            if (prodBrand) {
                // to do
            }
        },
        []
    );

    return (
        <>
            {isCameraEnabled ? (
                <Camera
                    onPhotoTaked={onPhotoTaked}
                    onBackButtonPressed={handleDisableCamera}
                />
            ) : (
                <Container>
                    <Interstitial ref={InterstitialRef} />

                    <Header
                        title={strings.View_AddProduct_PageTitle}
                        noDrawer
                    />
                    <PageContent>
                        {userPreferences.isPRO && !!photoPath && (
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
                                <InputTextContainer hasError={nameFieldError}>
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
                                    <Icon name="camera-outline" size={36} />
                                </CameraButtonContainer>
                            </InputGroup>
                            {nameFieldError && (
                                <InputTextTip>
                                    {
                                        strings.View_AddProduct_AlertTypeProductName
                                    }
                                </InputTextTip>
                            )}

                            <InputCode
                                code={code}
                                setCode={setCode}
                                onDuplicateProduct={handleDuplicate}
                                onCompleteInfo={onCompleteInfo}
                                BrandsPickerRef={BrandsPickerRef}
                                selectedStoreId={selectedStore || undefined}
                            />

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
                                        onChange={value => setLote(value)}
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
                                        onChange={handleAmountChange}
                                    />
                                </InputGroup>

                                <Currency
                                    value={price}
                                    onChangeValue={handlePriceChange}
                                    delimiter={currency === 'BRL' ? ',' : '.'}
                                    placeholder={
                                        strings.View_AddProduct_InputPlacehoder_UnitPrice
                                    }
                                />

                                {userPreferences.isPRO && (
                                    <>
                                        <DaysToBeNext onChange={setDaysNext} />

                                        <CategorySelect
                                            onChange={setSelectedCategory}
                                            defaultValue={selectedCategory}
                                            containerStyle={{
                                                marginBottom: 10,
                                            }}
                                        />

                                        <BrandSelect
                                            ref={BrandsPickerRef}
                                            onChange={setSelectedBrand}
                                            defaultValue={selectedBrand}
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
                                    {strings.View_AddProduct_CalendarTitle}
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
                            text={strings.View_AddProduct_Button_Save}
                            onPress={handleSave}
                        />
                        <PaddingComponent />
                    </PageContent>
                </Container>
            )}
        </>
    );
};

export default Add;
