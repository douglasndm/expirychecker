import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Keyboard, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button as ButtonPaper, Dialog, useTheme } from 'react-native-paper';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import GenericButton from '../../Components/Button';

import { getAdsEnabled } from '../../Functions/Settings';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '../../Functions/Product';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    Camera,
} from './styles';

const AddProduct = ({ navigation }) => {
    const theme = useTheme();

    const [adsEnabled, setAdsEnabled] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());

    const [cameraEnabled, setCameraEnebled] = useState(false);
    const [productAlreadyExists, setProductAlreadyExists] = useState(false);

    const [adReady, setAdReady] = useState(false);

    const adUnitID = __DEV__
        ? TestIds.INTERSTITIAL
        : EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;

    const interstitialAd = InterstitialAd.createForAdRequest(adUnitID);

    interstitialAd.load();

    async function handleSave() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        if (!(await checkIfProductAlreadyExistsByCode(code))) {
            try {
                const newProduct = {
                    name,
                    code,
                    lotes: [
                        {
                            lote,
                            exp_date: expDate,
                            amount,
                            status: 'Não tratado',
                        },
                    ],
                };

                await createProduct(newProduct);

                if (adsEnabled && adReady) {
                    await interstitialAd.show();
                }

                navigation.push('Home', {
                    notificationToUser: 'Produto cadastrado.',
                });
            } catch (error) {
                console.warn(error);
            }
        } else {
            setProductAlreadyExists(true);
        }
    }
    useEffect(() => {
        async function getAppData() {
            if (await getAdsEnabled()) {
                setAdsEnabled(true);
            } else {
                setAdsEnabled(false);
            }
        }

        getAppData();
    }, []);

    useEffect(() => {
        const eventListener = interstitialAd.onAdEvent((type) => {
            if (type === AdEventType.LOADED) {
                setAdReady(true);
            }
            if (type === AdEventType.CLOSED) {
                setAdReady(false);

                // reload ad
                interstitialAd.load();
            }
        });

        // Start loading the interstitial straight away
        interstitialAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, [adReady]);

    return (
        <>
            {cameraEnabled ? (
                <View
                    style={{
                        backgroundColor: theme.colors.background,
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            flex: 1,
                        }}
                    >
                        <Camera
                            captureAudio={false}
                            type="back"
                            autoFocus="on"
                            flashMode="auto"
                            googleVisionBarcodeType={
                                Camera.Constants.GoogleVisionBarcodeDetection
                                    .BarcodeType.EAN_13
                            }
                            googleVisionBarcodeMode={
                                Camera.Constants.GoogleVisionBarcodeDetection
                                    .BarcodeMode.ALTERNATE
                            }
                            barCodeTypes={[Camera.Constants.BarCodeType.ean13]}
                            onBarCodeRead={({ data }) => {
                                setCode(data);
                                setCameraEnebled(false);
                            }}
                        />
                    </View>

                    <GenericButton
                        text="Fechar"
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={() => setCameraEnebled(false)}
                    />
                </View>
            ) : (
                <Container style={{ backgroundColor: theme.colors.background }}>
                    <ScrollView>
                        <PageTitle style={{ color: theme.colors.text }}>
                            Adicionar um novo produto
                        </PageTitle>

                        <InputContainer>
                            <InputText
                                style={{
                                    backgroundColor:
                                        theme.colors.inputBackground,
                                    color: theme.colors.inputText,
                                }}
                                placeholder="Nome do produto"
                                placeholderTextColor={theme.colors.subText}
                                accessibilityLabel="Campo de texto para nome do produto"
                                value={name}
                                onChangeText={(value) => {
                                    setName(value);
                                }}
                                onFocus={() => {
                                    setCameraEnebled(false);
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <InputText
                                    style={{
                                        flex: 1,
                                        backgroundColor:
                                            theme.colors.inputBackground,
                                        color: theme.colors.inputText,
                                    }}
                                    placeholder="Código"
                                    placeholderTextColor={theme.colors.subText}
                                    accessibilityLabel="Campo de texto para código de barras do produto"
                                    value={code}
                                    onChangeText={(value) => setCode(value)}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />
                                <ButtonPaper
                                    style={{
                                        alignSelf: 'center',
                                        marginBottom: 8,
                                    }}
                                    icon={() => (
                                        <Ionicons
                                            name="camera-outline"
                                            size={42}
                                            color={theme.colors.text}
                                        />
                                    )}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        setCameraEnebled(!cameraEnabled);
                                    }}
                                />
                            </View>

                            <InputGroup>
                                <InputText
                                    style={{
                                        backgroundColor:
                                            theme.colors.inputBackground,
                                        color: theme.colors.inputText,
                                        flex: 3,
                                        marginRight: 5,
                                    }}
                                    placeholder="Lote"
                                    placeholderTextColor={theme.colors.subText}
                                    accessibilityLabel="Campo de texto para lote do produto"
                                    value={lote}
                                    onChangeText={(value) => setLote(value)}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />
                                <InputText
                                    style={{
                                        flex: 2,
                                        backgroundColor:
                                            theme.colors.inputBackground,
                                        color: theme.colors.inputText,
                                    }}
                                    placeholder="Quantidade"
                                    placeholderTextColor={theme.colors.subText}
                                    accessibilityLabel="Campo de texto para quantidade do produto"
                                    keyboardType="numeric"
                                    value={String(amount)}
                                    onChangeText={(v) => {
                                        const regex = /^[0-9\b]+$/;

                                        if (v === '' || regex.test(v)) {
                                            setAmount(v);
                                        }
                                    }}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />
                            </InputGroup>

                            <ExpDateGroup>
                                <ExpDateLabel
                                    style={{ color: theme.colors.subText }}
                                >
                                    Data de vencimento
                                </ExpDateLabel>

                                <CustomDatePicker
                                    style={{
                                        backgroundColor:
                                            theme.colors.productBackground,
                                    }}
                                    textColor={theme.colors.inputText}
                                    accessibilityLabel="Campo de seleção da data de vencimento do produto"
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

                        <GenericButton
                            text="Salvar"
                            accessibilityLabel="Botão para salvar o novo produto"
                            onPress={() => handleSave()}
                        />
                    </ScrollView>
                </Container>
            )}

            <Dialog
                visible={productAlreadyExists}
                onDismiss={() => {
                    setProductAlreadyExists(false);
                }}
                style={{ backgroundColor: theme.colors.background }}
            >
                <Dialog.Title>Produto duplicado</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.text }}>
                        Não é possível adicionar este produto pois já existe um
                        mesmo com esse código. Você pode editar o produto
                        existente adicionando um novo lote a ele ou trocar o
                        código do produto que está tentando adicionar.
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <ButtonPaper
                        color={theme.colors.accent}
                        onPress={async () => {
                            const existsProductCode = await getProductByCode(
                                code
                            );
                            navigation.push('ProductDetails', {
                                id: existsProductCode.id,
                            });
                        }}
                    >
                        Editar produto existente
                    </ButtonPaper>
                    <ButtonPaper
                        color={theme.colors.accent}
                        onPress={() => {
                            setProductAlreadyExists(false);
                        }}
                    >
                        Fechar
                    </ButtonPaper>
                </Dialog.Actions>
            </Dialog>
        </>
    );
};

export default AddProduct;
