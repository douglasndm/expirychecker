import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import EnvConfig from 'react-native-config';
import { showMessage } from 'react-native-flash-message';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

import strings from '~/Locales';

import Loading from '~/Components/Loading';
import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';
import GenericButton from '~/Components/Button';

import { createLote } from '~/Functions/Lotes';
import { getProductById } from '~/Functions/Product';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    PageContent,
    InputContainer,
    InputTextContainer,
    InputCodeText,
    Currency,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '~/Views/Product/Add/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';

interface Props {
    route: {
        params: {
            productId: number;
        };
    };
}

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_BATCH;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDLOTE;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

const AddBatch: React.FC<Props> = ({ route }: Props) => {
    const { productId } = route.params;
    const { navigate } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

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
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<string>('');
    const [price, setPrice] = useState<number | null>(null);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!lote || lote.trim() === '') {
            showMessage({
                message: strings.View_AddBatch_AlertTypeBatchName,
                type: 'danger',
            });
            return;
        }
        try {
            await createLote({
                productId,
                lote: {
                    lote,
                    amount: Number(amount),
                    exp_date: expDate,
                    price: price || undefined,
                    status: 'Não tratado',
                },
            });

            if (!userPreferences.disableAds && adReady) {
                await interstitialAd.show();
            }

            navigate('Success', {
                type: 'create_batch',
                productId,
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [
        lote,
        productId,
        amount,
        expDate,
        price,
        userPreferences.disableAds,
        adReady,
        navigate,
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

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const prod = await getProductById(productId);

            if (prod) {
                setName(prod.name);

                if (prod.code) setCode(prod.code);
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAmountChange = useCallback(value => {
        const regex = /^[0-9\b]+$/;

        if (value === '' || regex.test(value)) {
            setAmount(value);
        }
    }, []);

    const handlePriceChange = useCallback((value: number) => {
        if (value <= 0) {
            setPrice(null);
            return;
        }
        setPrice(value);
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <StatusBar />
            <ScrollView>
                <Header title={strings.View_AddBatch_PageTitle} noDrawer />

                <PageContent>
                    <InputContainer>
                        <ProductHeader>
                            <ProductName>{name}</ProductName>
                            <ProductCode>{code}</ProductCode>
                        </ProductHeader>

                        <InputGroup>
                            <InputTextContainer
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                            >
                                <InputCodeText
                                    placeholder={
                                        strings.View_AddBatch_InputPlacehoder_Batch
                                    }
                                    value={lote}
                                    onChangeText={value => setLote(value)}
                                />
                            </InputTextContainer>
                            <InputTextContainer
                                style={{
                                    flex: 4,
                                }}
                            >
                                <InputCodeText
                                    placeholder={
                                        strings.View_AddBatch_InputPlacehoder_Amount
                                    }
                                    keyboardType="numeric"
                                    value={amount}
                                    onChangeText={handleAmountChange}
                                />
                            </InputTextContainer>
                        </InputGroup>

                        <Currency
                            value={price}
                            onChangeValue={handlePriceChange}
                            delimiter={currency === 'BRL' ? ',' : '.'}
                            placeholder={
                                strings.View_AddBatch_InputPlacehoder_UnitPrice
                            }
                        />

                        <ExpDateGroup>
                            <ExpDateLabel>
                                {strings.View_AddBatch_CalendarTitle}
                            </ExpDateLabel>
                            <CustomDatePicker
                                date={expDate}
                                onDateChange={value => {
                                    setExpDate(value);
                                }}
                                locale={locale}
                            />
                        </ExpDateGroup>
                    </InputContainer>

                    <GenericButton
                        text={strings.View_AddBatch_Button_Save}
                        onPress={handleSave}
                    />
                </PageContent>
            </ScrollView>
        </Container>
    );
};

export default AddBatch;
