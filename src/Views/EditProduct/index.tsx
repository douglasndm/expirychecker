import React, { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from 'styled-components';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import { getProductById, updateProduct } from '../../Functions/Product';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
    Camera,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from '../AddProduct/styles';

import { ButtonPaper, Icons, SaveCancelButtonsContainer } from './styles';
import PreferencesContext from '../../Contexts/PreferencesContext';
import Loading from '../../Components/Loading';

interface RequestParams {
    route: {
        params: {
            productId: number;
        };
    };
}

const EditProduct: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { userPreferences } = useContext(PreferencesContext);
    const { productId } = route.params;

    const { reset, goBack } = useNavigation();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [store, setStore] = useState<string>('');

    const [cameraEnabled, setCameraEnebled] = useState(false);

    useEffect(() => {
        async function getProductData() {
            setIsLoading(true);
            const product = await getProductById(productId);

            if (!product) {
                throw new Error('Produto não encontrado');
            }

            setName(product.name);
            if (product.code) setCode(product.code);
            if (product.store) setStore(product.store);

            setIsLoading(false);
        }
        getProductData();
    }, [productId]);

    async function updateProd() {
        if (!name || name.trim() === '') {
            Alert.alert('Digite o nome do produto');
            return;
        }

        try {
            await updateProduct({
                id: productId,
                name,
                code,
                store,
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

    return isLoading ? (
        <Loading />
    ) : (
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

                            {userPreferences.multiplesStores && (
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

                            <SaveCancelButtonsContainer>
                                <ButtonPaper
                                    icon={() => (
                                        <Icons name="save-outline" size={22} />
                                    )}
                                    onPress={updateProd}
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
                            </SaveCancelButtonsContainer>
                        </InputContainer>
                    </PageContent>
                </Container>
            )}
        </>
    );
};

export default EditProduct;
