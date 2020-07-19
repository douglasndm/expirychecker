import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    Camera,
} from '../AddProduct/styles';

const EditProduct = ({ navigation, route }) => {
    const { product } = route.params;

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [cameraEnabled, setCameraEnebled] = useState(false);

    useEffect(() => {
        setName(product.name);
        setCode(product.code);
    }, []);

    async function updateProduct() {
        try {
            const realm = await Realm();

            realm.write(() => {
                realm.create(
                    'Product',
                    { id: product.id, name, code },
                    'modified'
                );
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container>
            <PageTitle>Editar produto</PageTitle>

            <InputContainer>
                <InputText
                    placeholder="Nome do produto"
                    accessibilityLabel="Campo de texto para nome do produto"
                    value={name}
                    onChangeText={(value) => {
                        setName(value);
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
                        placeholder="Código"
                        accessibilityLabel="Campo de texto para código de barras do produto"
                        value={code}
                        onChangeText={(value) => setCode(value)}
                        style={{ flex: 1 }}
                    />
                    <Button
                        style={{
                            alignSelf: 'center',
                            marginBottom: 8,
                        }}
                        icon={() => (
                            <Ionicons
                                name="camera-outline"
                                size={42}
                                color="black"
                            />
                        )}
                        onPress={() => {
                            setCameraEnebled(!cameraEnabled);
                        }}
                    />
                </View>

                {cameraEnabled ? (
                    <Camera
                        captureAudio={false}
                        type="back"
                        ratio="7:16"
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
                ) : null}

                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Button
                        icon={() => (
                            <Ionicons
                                name="save-outline"
                                color="black"
                                size={22}
                            />
                        )}
                        color="#14d48f"
                        onPress={() => {
                            updateProduct();
                        }}
                    >
                        Salvar
                    </Button>
                    <Button
                        icon={() => (
                            <Ionicons
                                name="exit-outline"
                                color="black"
                                size={22}
                            />
                        )}
                        color="#14d48f"
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        Cancelar
                    </Button>
                </View>
            </InputContainer>
        </Container>
    );
};

export default EditProduct;
