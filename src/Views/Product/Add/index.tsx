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
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import { exists, unlink } from 'react-native-fs';
import { translate } from '~/Locales';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '~/Functions/Product';
import { createLote } from '~/Functions/Lotes';
import { isProImagesByRewards } from '~/Functions/Pro/Rewards/Images';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';
import GenericButton from '~/Components/Button';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';
import Notification from '~/Components/Notification';

import RewardCamera from '../Components/RewardCamera';

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
    NumericInputField,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from './styles';

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_PRODUCT;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

const Add: React.FC = () => {
    const { goBack, navigate, reset } = useNavigation();

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
    const [isProByReward, setIsProByReward] = useState<boolean>(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photoFileName, setPhotoFileName] = useState('');
    const [photoPath, setPhotoPath] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [store, setStore] = useState<string>();
    const [expDate, setExpDate] = useState(new Date());

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);
    const [codeFieldError, setCodeFieldError] = useState<boolean>(false);

    const [existentProduct, setExistentProduct] = useState<number | null>(null);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);
    const [erro, setError] = useState<string>('');

    async function handleSave() {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        if (nameFieldError || codeFieldError) {
            return;
        }
        try {
            const newProduct: Omit<IProduct, 'id'> = {
                name,
                code,
                store,
                photo: photoFileName,
                lotes: [],
            };

            const newLote: Omit<ILote, 'id'> = {
                lote,
                exp_date: expDate,
                amount: Number(amount),
                price,
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

                reset({
                    index: 1,
                    routes: [
                        { name: 'Home' },
                        {
                            name: 'Success',
                            params: {
                                type: 'create_product',
                                productId: productCreatedId,
                            },
                        },
                    ],
                });
            }
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        isProImagesByRewards().then((response) => setIsProByReward(response));
    }, []);

    useEffect(() => {
        const eventListener = interstitialAd.onAdEvent((type) => {
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

    const handleAmountChange = useCallback((value) => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setIsBarCodeEnabled(false);
    }, []);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    const handleEnableCamera = useCallback(async () => {
        if (photoPath) {
            if (await exists(photoPath)) {
                await unlink(photoPath);
            }
        }
        setIsBarCodeEnabled(false);
        setIsCameraEnabled(true);
    }, [photoPath]);

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
        async ({ fileName, filePath }: onPhotoTakedProps) => {
            if (await exists(filePath)) {
                setPhotoPath(filePath);
                setPhotoFileName(fileName);
            }

            handleDisableCamera();
        },
        [handleDisableCamera]
    );

    const handleCheckProductCode = useCallback(async () => {
        const prodExist = await checkIfProductAlreadyExistsByCode({
            productCode: code,
            productStore: store || undefined,
        });

        if (prodExist) {
            setCodeFieldError(true);

            const existProd = await getProductByCode(code, store || undefined);
            setExistentProduct(existProd.id);
        }
    }, [code, store]);

    const handleNavigateToExistProduct = useCallback(async () => {
        if (existentProduct) {
            navigate('AddLote', { productId: existentProduct });
        }
    }, [existentProduct, navigate]);

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
                                        {translate('View_AddProduct_PageTitle')}
                                    </PageTitle>
                                </PageHeader>

                                <PageContent>
                                    {(isProByReward ||
                                        userPreferences.isUserPremium) &&
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

                                    {!userPreferences.isUserPremium &&
                                        !isProByReward && (
                                            <RewardCamera
                                                setIsProByReward={
                                                    setIsProByReward
                                                }
                                            />
                                        )}

                                    <InputContainer>
                                        <InputGroup>
                                            <InputTextContainer
                                                hasError={nameFieldError}
                                            >
                                                <InputText
                                                    placeholder={translate(
                                                        'View_AddProduct_InputPlacehoder_Name'
                                                    )}
                                                    accessibilityLabel={translate(
                                                        'View_AddProduct_InputAccessibility_Name'
                                                    )}
                                                    value={name}
                                                    onChangeText={(value) => {
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

                                            {(userPreferences.isUserPremium ||
                                                isProByReward) && (
                                                <CameraButtonContainer
                                                    onPress={handleEnableCamera}
                                                >
                                                    <CameraButtonIcon />
                                                </CameraButtonContainer>
                                            )}
                                        </InputGroup>
                                        {nameFieldError && (
                                            <InputTextTip>
                                                {translate(
                                                    'View_AddProduct_AlertTypeProductName'
                                                )}
                                            </InputTextTip>
                                        )}

                                        <InputCodeTextContainer
                                            hasError={codeFieldError}
                                        >
                                            <InputCodeText
                                                placeholder={translate(
                                                    'View_AddProduct_InputPlacehoder_Code'
                                                )}
                                                accessibilityLabel={translate(
                                                    'View_AddProduct_InputAccessibility_Code'
                                                )}
                                                value={code}
                                                onChangeText={(value) => {
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
                                                {translate(
                                                    'View_AddProduct_Tip_DuplicateProduct'
                                                )}
                                            </InputTextTip>
                                        )}

                                        <InputGroup>
                                            <InputTextContainer
                                                style={{
                                                    flex: 5,
                                                    marginRight: 10,
                                                }}
                                            >
                                                <InputText
                                                    placeholder={translate(
                                                        'View_AddProduct_InputPlacehoder_Batch'
                                                    )}
                                                    accessibilityLabel={translate(
                                                        'View_AddProduct_InputAccessibility_Batch'
                                                    )}
                                                    value={lote}
                                                    onChangeText={(value) =>
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
                                                    placeholder={translate(
                                                        'View_AddProduct_InputPlacehoder_Amount'
                                                    )}
                                                    accessibilityLabel={translate(
                                                        'View_AddProduct_InputAccessibility_Amount'
                                                    )}
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

                                        <NumericInputField
                                            type="currency"
                                            locale={locale}
                                            currency={currency}
                                            value={price}
                                            onUpdate={(value: number) =>
                                                setPrice(value)
                                            }
                                            placeholder={translate(
                                                'View_AddProduct_InputPlacehoder_UnitPrice'
                                            )}
                                        />

                                        {userPreferences.multiplesStores && (
                                            <MoreInformationsContainer>
                                                <MoreInformationsTitle>
                                                    {translate(
                                                        'View_AddProduct_MoreInformation_Label'
                                                    )}
                                                </MoreInformationsTitle>

                                                <InputGroup>
                                                    <InputTextContainer>
                                                        <InputText
                                                            style={{
                                                                flex: 1,
                                                            }}
                                                            placeholder={translate(
                                                                'View_AddProduct_InputPlacehoder_Store'
                                                            )}
                                                            accessibilityLabel={translate(
                                                                'View_AddProduct_InputAccessibility_Store'
                                                            )}
                                                            onFocus={() => {
                                                                setIsBarCodeEnabled(
                                                                    false
                                                                );
                                                            }}
                                                            value={store}
                                                            onChangeText={(
                                                                value
                                                            ) =>
                                                                setStore(value)
                                                            }
                                                        />
                                                    </InputTextContainer>
                                                </InputGroup>
                                            </MoreInformationsContainer>
                                        )}

                                        <ExpDateGroup>
                                            <ExpDateLabel>
                                                {translate(
                                                    'View_AddProduct_CalendarTitle'
                                                )}
                                            </ExpDateLabel>

                                            <CustomDatePicker
                                                accessibilityLabel={translate(
                                                    'View_AddProduct_CalendarAccessibilityDescription'
                                                )}
                                                date={expDate}
                                                onDateChange={(value) => {
                                                    setExpDate(value);
                                                }}
                                                locale={locale}
                                            />
                                        </ExpDateGroup>
                                    </InputContainer>

                                    <GenericButton
                                        text={translate(
                                            'View_AddProduct_Button_Save'
                                        )}
                                        accessibilityLabel={translate(
                                            'View_AddProduct_Button_Save_AccessibilityDescription'
                                        )}
                                        onPress={handleSave}
                                    />
                                </PageContent>
                            </ScrollView>
                            {!!erro && (
                                <Notification
                                    NotificationType="error"
                                    NotificationMessage={erro}
                                    onPress={handleDimissNotification}
                                />
                            )}
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default Add;