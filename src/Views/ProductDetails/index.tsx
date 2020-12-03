import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components';
import { Button } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import { getProductById, deleteProduct } from '../../Functions/Product';
import { sortByBatchExpDate } from '../../Functions/Batches';

import BatchesTable from './BatchesTable';

import {
    Container,
    PageHeader,
    ProductDetailsContainer,
    PageTitleContent,
    PageTitle,
    ProductInformationContent,
    ProductName,
    ProductCode,
    ProductStore,
    PageContent,
    ButtonPaper,
    Icons,
    Text,
    DialogPaper,
    FloatButton,
} from './styles';

import PreferencesContext from '../../Contexts/PreferencesContext';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { navigate, goBack, reset } = useNavigation();
    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [product, setProduct] = useState<IProduct>();

    const [batches, setBatches] = useState<Array<IBatch>>([]);
    const [treatedBatches, setTreatedBatches] = useState<Array<IBatch>>([]);
    const [notTreatedBatches, setNotTreatedBatches] = useState<Array<IBatch>>(
        []
    );

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const getProduct = useCallback(async () => {
        try {
            const result = await getProductById(productId);

            if (!result || result === null) {
                goBack();
                return;
            }

            setProduct(result);

            setName(result.name);
            if (result.code) setCode(result.code);

            const lotesSorted = sortByBatchExpDate(result.batches);

            setBatches(lotesSorted);
        } catch (error) {
            crashlytics().recordError(error);
            console.warn(error);
        }
    }, [productId, goBack]);

    const addNewLote = useCallback(() => {
        navigate('AddLote', { productId });
    }, [navigate, productId]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { productId });
    }, [navigate, productId]);

    const handleDeleteProduct = useCallback(async () => {
        try {
            await deleteProduct(productId);

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_product' } },
                ],
            });
        } catch (err) {
            console.log(err);
        }
    }, [productId, reset]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        setTreatedBatches(() =>
            batches.filter((lote) => lote.status === 'Tratado')
        );

        setNotTreatedBatches(() =>
            batches.filter((lote) => lote.status !== 'Tratado')
        );
    }, [batches]);

    return (
        <>
            <Container>
                <ScrollView>
                    <PageHeader>
                        <ProductDetailsContainer>
                            <PageTitleContent>
                                <BackButton handleOnPress={goBack} />
                                <PageTitle>Detalhes</PageTitle>
                            </PageTitleContent>

                            <ProductInformationContent>
                                <ProductName>{name}</ProductName>
                                {!!code && (
                                    <ProductCode>Código: {code}</ProductCode>
                                )}
                                {userPreferences.multiplesStores &&
                                    !!product?.store && (
                                        <ProductStore>
                                            Loja: {product.store}
                                        </ProductStore>
                                    )}
                            </ProductInformationContent>
                        </ProductDetailsContainer>

                        <View>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="create-outline" size={22} />
                                )}
                                onPress={() => handleEdit()}
                            >
                                Editar
                            </ButtonPaper>
                            <ButtonPaper
                                icon={() => (
                                    <Icons name="trash-outline" size={22} />
                                )}
                                onPress={() => {
                                    setDeleteComponentVisible(true);
                                }}
                            >
                                Apagar
                            </ButtonPaper>
                        </View>
                    </PageHeader>

                    <PageContent>
                        {notTreatedBatches.length > 0 && (
                            <BatchesTable
                                productId={productId}
                                title="Todos os lotes não tratados"
                                batches={notTreatedBatches}
                            />
                        )}

                        {treatedBatches.length > 0 && (
                            <BatchesTable
                                productId={productId}
                                title="Todos os lotes tratados"
                                batches={treatedBatches}
                            />
                        )}

                        <GenericButton
                            text="Cadastrar novo lote"
                            onPress={() => {
                                navigate('AddLote', {
                                    productId,
                                });
                            }}
                        />
                    </PageContent>
                </ScrollView>
            </Container>

            <FloatButton
                icon={() => (
                    <Ionicons name="add-outline" color="white" size={22} />
                )}
                small
                label="Adicionar lote"
                onPress={addNewLote}
            />

            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title style={{ color: theme.colors.text }}>
                    Você tem certeza?
                </DialogPaper.Title>
                <DialogPaper.Content>
                    <Text style={{ color: theme.colors.text }}>
                        Se continuar você irá apagar o produto e todos os seus
                        lotes
                    </Text>
                </DialogPaper.Content>
                <DialogPaper.Actions>
                    <Button color="red" onPress={handleDeleteProduct}>
                        APAGAR
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        MANTER
                    </Button>
                </DialogPaper.Actions>
            </DialogPaper>
        </>
    );
};

export default ProductDetails;
