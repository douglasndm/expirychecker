import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Keyboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button as ButtonPaper, Dialog, useTheme } from 'react-native-paper';
import { setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import Realm from '../../Services/Realm';
import {
    checkIfProductAlreadyExistsByCode,
    getProductByCode,
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
    Button,
    ButtonText,
} from './styles';

const AddProduct = ({ navigation }) => {
    const theme = useTheme();

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
        const realm = await Realm();

        if (!(await checkIfProductAlreadyExistsByCode(code))) {
            try {
                // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
                // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
                const lastProduct = realm
                    .objects('Product')
                    .sorted('id', true)[0];
                const nextProductId =
                    lastProduct == null ? 1 : lastProduct.id + 1;

                const lastLote = realm.objects('Lote').sorted('id', true)[0];
                const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

                realm.write(() => {
                    const productResult = realm.create('Product', {
                        id: nextProductId,
                        name,
                        code,
                    });

                    // UM MONTE DE SETS PARA DEIXAR A HORA COMPLETAMENTE ZERADA
                    // E CONSIDERAR APENAS OS DIAS NO CONTROLE DE VENCIMENTO
                    const formatedDate = setHours(
                        setMinutes(
                            setSeconds(setMilliseconds(expDate, 0), 0),
                            0
                        ),
                        0
                    );

                    productResult.lotes.push({
                        id: nextLoteId,
                        lote,
                        exp_date: formatedDate,
                        amount: parseInt(amount),
                    });

                    // Vefica o id gerado no banco de dados e divide por 2 e se o resto da divisao for zero mostra um ad
                    // Fazendo isso apenas para reduzir a quantidade de ads e não irritar o usuário
                    // principalmente os que acabaram de baixar o app e terão que cadastrar multiplos produtos
                    if (adReady && productResult.id % 2 === 0) {
                        interstitialAd.show();
                    }

                    navigation.push('Home', {
                        notificationToUser: 'Produto cadastrado.',
                    });
                });
            } catch (error) {
                console.warn(error);
            }
        } else {
            setProductAlreadyExists(true);
        }
    }

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
                <>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
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

                    <Button
                        style={{
                            alignSelf: 'center',
                        }}
                        onPress={() => setCameraEnebled(false)}
                    >
                        <ButtonText>Fechar</ButtonText>
                    </Button>
                </>
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
                                    onChangeText={(value) => setAmount(value)}
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
                                    textColor={theme.colors.text}
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

                        <Button
                            style={{ backgroundColor: theme.colors.accent }}
                            accessibilityLabel="Botão para salvar o novo produto"
                            onPress={() => handleSave()}
                        >
                            <ButtonText>Salvar</ButtonText>
                        </Button>
                    </ScrollView>
                </Container>
            )}

            <Dialog
                visible={productAlreadyExists}
                onDismiss={() => {
                    setProductAlreadyExists(false);
                }}
            >
                <Dialog.Title>Produto duplicado</Dialog.Title>
                <Dialog.Content>
                    <Text>
                        Não é possível adicionar este produto pois já existe um
                        mesmo com esse código. Você pode editar o produto
                        existente adicionando um novo lote a ele ou trocar o
                        código do produto que está tentando adicionar.
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <ButtonPaper
                        color="#14d48f"
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
                        color="#14d48f"
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
