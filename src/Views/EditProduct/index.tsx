import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import BarCodeReader from '../../Components/BarCodeReader';
import Notification from '../../Components/Notification';

import { getProductById, updateProduct } from '../../Functions/Product';

import PreferencesContext from '../../Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
} from '../AddProduct/styles';

import { ButtonPaper, Icons, SaveCancelButtonsContainer } from './styles';

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
    const [error, setError] = useState<string>('');

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
            setError('Digite o nome do produto');
            return;
        }

        try {
            updateProduct({
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
            setError(err.message);
        }
    }

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setCameraEnebled(false);
    }, []);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {cameraEnabled ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={() => setCameraEnebled(false)}
                />
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

                    {!!error && (
                        <Notification
                            NotificationMessage={error}
                            NotificationType="error"
                            onPress={handleDimissNotification}
                        />
                    )}
                </Container>
            )}
        </>
    );
};

export default EditProduct;
