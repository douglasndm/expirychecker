import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { createLote } from '../../Functions/Lotes';
import { getProductById } from '../../Functions/Product';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
    NumericInputField,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '../AddProduct/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';

interface AddLoteParams {
    route: {
        params: {
            productId: number;
        };
    };
}
const adUnitID = __DEV__
    ? TestIds.INTERSTITIAL
    : EnvConfig.ANDROID_ADMOB_ADUNITID_ADDLOTE;

const interstitialAd = InterstitialAd.createForAdRequest(adUnitID);

const AddLote: React.FC<AddLoteParams> = ({ route }: AddLoteParams) => {
    const { productId } = route.params;
    const { reset, goBack } = useNavigation();

    const { isUserPremium } = useContext(PreferencesContext);

    const theme = useTheme();
    const [notification, setNotification] = useState<string>();

    const [adReady, setAdReady] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }
        try {
            await createLote({
                productId,
                lote: {
                    lote,
                    amount,
                    exp_date: expDate,
                    price,
                },
            });

            if (!isUserPremium && adReady) {
                interstitialAd.show();
            }

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'ProductDetails', params: { id: productId } },
                    { name: 'Success', params: { type: 'create_batch' } },
                ],
            });
        } catch (err) {
            crashlytics().recordError(err);
            setNotification(err);
        }
    }, [
        amount,
        productId,
        expDate,
        lote,
        reset,
        price,
        adReady,
        isUserPremium,
    ]);

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

    useEffect(() => {
        async function getProduct() {
            const prod = await getProductById(productId);

            if (prod) {
                setName(prod.name);

                if (prod.code) setCode(prod.code);
            }
        }
        getProduct();
    }, [productId]);

    return (
        <Container>
            <ScrollView>
                <PageHeader>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>Adicionar um lote</PageTitle>
                </PageHeader>

                <PageContent>
                    <InputContainer>
                        <ProductHeader>
                            <ProductName>{name}</ProductName>
                            <ProductCode>{code}</ProductCode>
                        </ProductHeader>

                        <InputGroup>
                            <InputText
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                                placeholder="Lote"
                                value={lote}
                                onChangeText={(value) => setLote(value)}
                            />
                            <InputText
                                style={{
                                    flex: 4,
                                }}
                                placeholder="Quantidade"
                                keyboardType="numeric"
                                value={String(amount)}
                                onChangeText={(value) => {
                                    const regex = /^[0-9\b]+$/;

                                    if (value === '' || regex.test(value)) {
                                        if (value === '') {
                                            setAmount(0);
                                            return;
                                        }
                                        setAmount(Number(value));
                                    }
                                }}
                            />
                        </InputGroup>

                        <NumericInputField
                            type="currency"
                            locale="pt-BR"
                            currency="BRL"
                            value={price}
                            onUpdate={(value: number) => setPrice(value)}
                            placeholder="Valor unitário"
                        />

                        <ExpDateGroup>
                            <ExpDateLabel>Data de vencimento</ExpDateLabel>
                            <CustomDatePicker
                                date={expDate}
                                onDateChange={(value) => {
                                    setExpDate(value);
                                }}
                                fadeToColor="none"
                                mode="date"
                                locale="pt-br"
                            />
                        </ExpDateGroup>
                    </InputContainer>

                    <GenericButton text="Salvar" onPress={handleSave} />
                </PageContent>
            </ScrollView>

            {!!notification && (
                <Notification
                    NotificationMessage={notification}
                    NotificationType="error"
                />
            )}
        </Container>
    );
};

export default AddLote;
