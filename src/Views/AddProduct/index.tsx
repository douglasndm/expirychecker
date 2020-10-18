import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Button as ButtonPaper, Dialog } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import GenericButton from '../../Components/Button';

import { getMultipleStores } from '../../Functions/Settings';
import { GetPremium } from '../../Functions/Premium';

import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
    createProduct,
} from '../../Functions/Product';

import { createLote } from '../../Functions/Lotes';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    NumericInputField,
    InputGroup,
    MoreInformationsContainer,
    MoreInformationsTitle,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    Camera,
} from './styles';

const adUnitID = __DEV__
    ? TestIds.INTERSTITIAL
    : EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;

const interstitialAd = InterstitialAd.createForAdRequest(adUnitID);

const AddProduct: React.FC = () => {
    const navigation = useNavigation();
    const theme = useTheme();

    const [isPremium, setIsPremium] = useState(false);
    const [adReady, setAdReady] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [store, setStore] = useState<string>();

    const [expDate, setExpDate] = useState(new Date());

    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const [cameraEnabled, setCameraEnebled] = useState(false);
    const [productAlreadyExists, setProductAlreadyExists] = useState(false);

    async function handleSave() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        if (!(await checkIfProductAlreadyExistsByCode(code))) {
            try {
                const newProduct: Omit<IProduct, 'id'> = {
                    name,
                    code,
                    store,
                    lotes: [],
                };

                const newLote: Omit<ILote, 'id'> = {
                    lote,
                    exp_date: expDate,
                    amount: Number(amount),
                    price,
                    status: 'Não tratado',
                };

                const productCreatedId = await createProduct(newProduct);

                if (productCreatedId) {
                    await createLote({
                        lote: newLote,
                        productId: productCreatedId,
                    });

                    if (!!isPremium && adReady) {
                        interstitialAd.show();
                    }

                    navigation.push('Home', {
                        notificationToUser: 'Produto cadastrado.',
                    });
                }
            } catch (error) {
                console.warn(error);
            }
        } else {
            setProductAlreadyExists(true);
        }
    }

    useEffect(() => {
        getMultipleStores().then((data) => {
            setMultipleStoresState(data);
        });
    }, []);

    useEffect(() => {
        async function getAppData() {
            if (!(await GetPremium())) {
                setIsPremium(true);

                interstitialAd.load();
            } else {
                setIsPremium(false);
            }
        }

        getAppData();

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
                        onPress={() => setCameraEnebled(false)}
                    />
                </View>
            ) : (
                <Container>
                    <ScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginLeft: -15,
                            }}
                        >
                            <ButtonPaper
                                style={{
                                    alignSelf: 'flex-end',
                                }}
                                icon={() => (
                                    <Ionicons
                                        name="arrow-back-outline"
                                        size={28}
                                        color={theme.colors.text}
                                    />
                                )}
                                compact
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <PageTitle>Novo produto</PageTitle>
                        </View>

                        <InputContainer>
                            <InputText
                                placeholder="Nome do produto"
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
                                    style={{ flex: 1 }}
                                    placeholder="Código"
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
                                        flex: 5,
                                        marginRight: 5,
                                    }}
                                    placeholder="Lote"
                                    accessibilityLabel="Campo de texto para lote do produto"
                                    value={lote}
                                    onChangeText={(value) => setLote(value)}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />
                                <InputText
                                    style={{
                                        flex: 4,
                                    }}
                                    placeholder="Quantidade"
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

                            <NumericInputField
                                type="currency"
                                locale="pt-BR"
                                currency="BRL"
                                value={price}
                                onUpdate={(value: number) => setPrice(value)}
                                placeholder="Valor unitário"
                            />

                            {multipleStoresState && (
                                <MoreInformationsContainer>
                                    <MoreInformationsTitle>
                                        Mais informações
                                    </MoreInformationsTitle>

                                    <InputGroup>
                                        <InputText
                                            style={{
                                                flex: 1,
                                            }}
                                            placeholder="Loja"
                                            accessibilityLabel="Campo de texto para loja de onde o produto está cadastrado"
                                            onFocus={() => {
                                                setCameraEnebled(false);
                                            }}
                                            value={store}
                                            onChangeText={(value) =>
                                                setStore(value)
                                            }
                                        />
                                    </InputGroup>
                                </MoreInformationsContainer>
                            )}

                            <ExpDateGroup>
                                <ExpDateLabel>Data de vencimento</ExpDateLabel>

                                <CustomDatePicker
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
                            onPress={handleSave}
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
