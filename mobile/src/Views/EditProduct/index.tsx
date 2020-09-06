import React, { useState, useEffect } from 'react';
import { View, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import Realm from '../../Services/Realm';
import { getProductById } from '../../Functions/Product';

import GenericButton from '../../Components/Button';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
} from '../AddProduct/styles';

import { Camera, ButtonPaper, Icons } from './styles';

interface RequestParams {
    route: {
        params: {
            productId: number;
        };
    };
}

const EditProduct: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { productId } = route.params;

    const navigation = useNavigation();

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [cameraEnabled, setCameraEnebled] = useState(false);

    useEffect(() => {
        async function getProductData() {
            const product = await getProductById(productId);

            if (!product) {
                navigation.push('Home', {
                    notificationToUser: 'Produto não encontrado',
                });

                return;
            }

            setName(product.name);
            if (product.code) setCode(product.code);
        }
        getProductData();
    }, [productId, navigation]);

    async function updateProduct() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        try {
            Realm.write(() => {
                Realm.create(
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
                        onPress={() => setCameraEnebled(false)}
                    />
                </View>
            ) : (
                <Container>
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
                                <Icons name="arrow-back-outline" size={28} />
                            )}
                            compact
                            onPress={() => {
                                navigation.goBack();
                            }}
                        />
                        <PageTitle>Editar produto</PageTitle>
                    </View>

                    <InputContainer>
                        <InputText
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
                                    <Icons name="camera-outline" size={42} />
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
                                    <Icons name="save-outline" size={22} />
                                )}
                                onPress={() => {
                                    updateProduct();
                                }}
                            >
                                Salvar
                            </ButtonPaper>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="exit-outline" size={22} />
                                )}
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
