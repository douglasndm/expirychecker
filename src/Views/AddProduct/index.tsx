import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { Button as ButtonPaper, Dialog } from 'react-native-paper';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { getProductByCode, createProduct } from '../../Functions/Product';

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
    MoreInformationsContainer,
    MoreInformationsTitle,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    Camera,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from './styles';

const adUnitID = __DEV__
    ? TestIds.INTERSTITIAL
    : EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;

const interstitialAd = InterstitialAd.createForAdRequest(adUnitID);

const AddProduct: React.FC = () => {
    const { goBack, navigate, reset } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const theme = useTheme();

    const [adReady, setAdReady] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [store, setStore] = useState<string>();

    const [expDate, setExpDate] = useState(new Date());

    const [cameraEnabled, setCameraEnebled] = useState(false);
    const [productAlreadyExists, setProductAlreadyExists] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>('');

    async function handleSave() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        try {
            const newProduct: Omit<IProduct, 'id'> = {
                name,
                code,
                store,
                batches: [],
            };

            const newLote: Omit<IBatch, 'id'> = {
                name: lote,
                exp_date: expDate,
                amount: Number(amount),
                price,
                status: 'Não tratado',
            };

            newProduct.batches.push(newLote);

            await createProduct(newProduct);

            if (!userPreferences.isUserPremium && adReady) {
                interstitialAd.show();
            }

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'create_product' } },
                ],
            });
        } catch (err) {
            console.warn(err);
            setErrorMessage(String(err));
        }
    }

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
                        <PageHeader>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>Novo produto</PageTitle>
                        </PageHeader>

                        <PageContent>
                            {!!errorMessage && (
                                <Notification
                                    NotificationType="error"
                                    NotificationMessage={errorMessage}
                                />
                            )}

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

                                <InputCodeTextContainer>
                                    <InputCodeText
                                        placeholder="Código do produto"
                                        accessibilityLabel="Campo de texto para código de barras do produto"
                                        value={code}
                                        onChangeText={(value) => setCode(value)}
                                    />
                                    <InputTextIconContainer
                                        onPress={() => setCameraEnebled(true)}
                                    >
                                        <InputCodeTextIcon />
                                    </InputTextIconContainer>
                                </InputCodeTextContainer>

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
                                        onChangeText={handleAmountChange}
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
                                    onUpdate={(value: number) =>
                                        setPrice(value)
                                    }
                                    placeholder="Valor unitário"
                                />

                                {userPreferences.multiplesStores && (
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
                                    <ExpDateLabel>
                                        Data de vencimento
                                    </ExpDateLabel>

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
                        </PageContent>
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
                            navigate('ProductDetails', {
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
