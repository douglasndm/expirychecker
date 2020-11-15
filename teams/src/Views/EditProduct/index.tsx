import React, { useState, useEffect, useContext } from 'react';
import { View, Keyboard, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import { getProductById } from '../../Functions/Product';
import { getMultipleStores } from '../../Functions/Settings';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
} from '../AddProduct/styles';

import { Camera, ButtonPaper, Icons } from './styles';
import RealmContext from '../../Contexts/RealmContext';

interface RequestParams {
    route: {
        params: {
            productId: number;
        };
    };
}

const EditProduct: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { Realm } = useContext(RealmContext);
    const { productId } = route.params;

    const { reset, goBack } = useNavigation();

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [store, setStore] = useState<string>('');
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const [cameraEnabled, setCameraEnebled] = useState(false);

    useEffect(() => {
        getMultipleStores().then((data) => {
            setMultipleStoresState(data);
        });
    }, []);

    useEffect(() => {
        async function getProductData() {
            const product = await getProductById(productId);

            if (!product) {
                throw new Error('Produto não encontrado');
            }

            setName(product.name);
            if (product.code) setCode(product.code);
            if (product.store) setStore(product.store);
        }
        getProductData();
    }, [productId]);

    async function updateProduct() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        try {
            Realm.write(() => {
                Realm.create(
                    'Product',
                    { id: productId, name, code, store },
                    'modified'
                );
            });

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'ProductDetails', params: { id: productId } },
                ],
            });
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
                    <PageHeader>
                        <BackButton handleOnPress={goBack} />
                        <PageTitle>Editar produto</PageTitle>
                    </PageHeader>

                    <PageContent>
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
                                    style={{
                                        flex: 1,
                                    }}
                                    placeholder="Código do produto"
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
                                        <Icons
                                            name="camera-outline"
                                            size={42}
                                        />
                                    )}
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        setCameraEnebled(!cameraEnabled);
                                    }}
                                />
                            </View>

                            {multipleStoresState && (
                                <InputText
                                    placeholder="Loja do produto"
                                    accessibilityLabel="Campo de texto para loja do produto"
                                    value={store}
                                    onChangeText={(value) => {
                                        setStore(value);
                                    }}
                                    onFocus={() => {
                                        setCameraEnebled(false);
                                    }}
                                />
                            )}

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
                                    onPress={goBack}
                                >
                                    Cancelar
                                </ButtonPaper>
                            </View>
                        </InputContainer>
                    </PageContent>
                </Container>
            )}
        </>
    );
};

export default EditProduct;
