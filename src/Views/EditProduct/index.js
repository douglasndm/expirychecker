import React, { useState, useEffect } from 'react';
import { View, Keyboard, Alert } from 'react-native';

import { Button as ButtonPaper, useTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';
import { getProductById } from '../../Functions/Product';

import GenericButton from '../../Components/Button';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
} from '../AddProduct/styles';

import { Camera } from './styles';

const EditProduct = ({ navigation, route }) => {
    const { productId } = route.params;

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [cameraEnabled, setCameraEnebled] = useState(false);

    useEffect(() => {
        async function getProductData() {
            const product = await getProductById(productId);

            setName(product.name);
            setCode(product.code);
        }
        getProductData();
    }, []);

    async function updateProduct() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        try {
            const realm = await Realm();

            realm.write(() => {
                realm.create(
                    'Product',
                    { id: productId, name, code },
                    'modified'
                );
            });

            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    }

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
                    <PageTitle style={{ color: theme.colors.text }}>
                        Editar produto
                    </PageTitle>

                    <InputContainer>
                        <InputText
                            style={{
                                backgroundColor: theme.colors.inputBackground,
                                color: theme.colors.text,
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
                                    color: theme.colors.text,
                                }}
                                placeholder="Código do produto"
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

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <ButtonPaper
                                icon={() => (
                                    <Ionicons
                                        name="save-outline"
                                        color={theme.colors.text}
                                        size={22}
                                    />
                                )}
                                color={theme.colors.accent}
                                onPress={() => {
                                    updateProduct();
                                }}
                            >
                                Salvar
                            </ButtonPaper>
                            <ButtonPaper
                                icon={() => (
                                    <Ionicons
                                        name="exit-outline"
                                        color={theme.colors.text}
                                        size={22}
                                    />
                                )}
                                color={theme.colors.accent}
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            >
                                Cancelar
                            </ButtonPaper>
                        </View>
                    </InputContainer>
                </Container>
            )}
        </>
    );
};

export default EditProduct;
