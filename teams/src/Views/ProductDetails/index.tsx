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

import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { getProductById, deleteProduct } from '../../Functions/Product';
import { sortLoteByExpDate } from '../../Functions/Lotes';

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
    CategoryDetails,
    CategoryDetailsText,
    TableContainer,
    Text,
    DialogPaper,
    FloatButton,
} from './styles';

import PreferencesContext from '../../Contexts/PreferencesContext';

import BatchTable from './BatchesTable';

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

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [product, setProduct] = useState<IProduct>();

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const getProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getProductById(productId);

            if (!result || result === null) {
                goBack();
                return;
            }

            setProduct(result);

            setName(result.name);
            if (result.code) setCode(result.code);

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (err) {
            crashlytics().recordError(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
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
            setError(err.message);
        }
    }, [productId, reset]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        setLotesTratados(() =>
            lotes.filter((lote) => lote.status === 'Tratado')
        );

        setLotesNaoTratados(() =>
            lotes.filter((lote) => lote.status !== 'Tratado')
        );
    }, [lotes]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    return isLoading ? (
        <Loading />
    ) : (
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
                        {lotesNaoTratados.length > 0 && (
                            <TableContainer>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        Todos os lotes ainda não tratados
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesNaoTratados}
                                    productId={productId}
                                />
                            </TableContainer>
                        )}

                        {lotesTratados.length > 0 && (
                            <>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        Todos os lotes tratados
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesTratados}
                                    productId={productId}
                                />
                            </>
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
                {!!error && (
                    <Notification
                        NotificationMessage={error}
                        NotificationType="error"
                        onPress={handleDimissNotification}
                    />
                )}
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
