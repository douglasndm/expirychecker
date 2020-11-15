import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components';
import { Button } from 'react-native-paper';
import br, { format, isPast, addDays } from 'date-fns';
import NumberFormat from 'react-number-format';

import Ionicons from 'react-native-vector-icons/Ionicons';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

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
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
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
    const { howManyDaysToBeNextToExpire, multiplesStores } = useContext(
        PreferencesContext
    );

    const { navigate, goBack, reset } = useNavigation();
    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [product, setProduct] = useState<IProduct>();

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

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

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
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
        setLotesTratados(() =>
            lotes.filter((lote) => lote.status === 'Tratado')
        );

        setLotesNaoTratados(() =>
            lotes.filter((lote) => lote.status !== 'Tratado')
        );
    }, [lotes]);

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
                                {multiplesStores && !!product?.store && (
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

                                <Table>
                                    <TableHeader>
                                        <TableTitle>LOTE</TableTitle>
                                        <TableTitle>VENCIMENTO</TableTitle>
                                        <TableTitle>QUANTIDADE</TableTitle>
                                        <TableTitle>PREÇO</TableTitle>
                                    </TableHeader>

                                    {lotesNaoTratados.map((lote) => {
                                        const expired = isPast(lote.exp_date);
                                        const nextToExp =
                                            addDays(
                                                new Date(),
                                                howManyDaysToBeNextToExpire
                                            ) > lote.exp_date;

                                        const expiredOrNext = !!(
                                            expired || nextToExp
                                        );

                                        return (
                                            <TableRow
                                                key={lote.id}
                                                expired={expired}
                                                nextToExp={nextToExp}
                                                onPress={() => {
                                                    navigate('EditLote', {
                                                        productId,
                                                        loteId: lote.id,
                                                    });
                                                }}
                                            >
                                                <TableCell>
                                                    <Text
                                                        expiredOrNext={
                                                            expiredOrNext
                                                        }
                                                    >
                                                        {lote.lote}
                                                    </Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text
                                                        expiredOrNext={
                                                            expiredOrNext
                                                        }
                                                    >
                                                        {format(
                                                            lote.exp_date,
                                                            'dd/MM/yyyy',
                                                            {
                                                                locale: br,
                                                            }
                                                        )}
                                                    </Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text
                                                        expiredOrNext={
                                                            expiredOrNext
                                                        }
                                                    >
                                                        {lote.amount}
                                                    </Text>
                                                </TableCell>
                                                {!!lote.amount &&
                                                    !!lote.price &&
                                                    lote.price > 0 && (
                                                        <TableCell>
                                                            <Text
                                                                expiredOrNext={
                                                                    expiredOrNext
                                                                }
                                                            >
                                                                <NumberFormat
                                                                    value={
                                                                        lote.amount *
                                                                        lote.price
                                                                    }
                                                                    displayType="text"
                                                                    thousandSeparator
                                                                    prefix="R$"
                                                                    renderText={(
                                                                        value
                                                                    ) => value}
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                />
                                                            </Text>
                                                        </TableCell>
                                                    )}
                                            </TableRow>
                                        );
                                    })}
                                </Table>
                            </TableContainer>
                        )}

                        {lotesTratados.length > 0 && (
                            <>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        Todos os lotes tratados
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <Table>
                                    <TableHeader>
                                        <TableTitle>LOTE</TableTitle>
                                        <TableTitle>VENCIMENTO</TableTitle>
                                        <TableTitle>QUANTIDADE</TableTitle>
                                        <TableTitle>PREÇO</TableTitle>
                                    </TableHeader>

                                    {lotesTratados.map((lote) => {
                                        return (
                                            <TableRow
                                                key={lote.id}
                                                onPress={() => {
                                                    navigate('EditLote', {
                                                        productId,
                                                        loteId: lote.id,
                                                    });
                                                }}
                                            >
                                                <TableCell>
                                                    <Text>{lote.lote}</Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>
                                                        {format(
                                                            lote.exp_date,
                                                            'dd/MM/yyyy',
                                                            {
                                                                locale: br,
                                                            }
                                                        )}
                                                    </Text>
                                                </TableCell>
                                                <TableCell>
                                                    <Text>{lote.amount}</Text>
                                                </TableCell>
                                                {!!lote.amount &&
                                                    !!lote.price &&
                                                    lote.price > 0 && (
                                                        <TableCell>
                                                            <Text>
                                                                <NumberFormat
                                                                    value={
                                                                        lote.amount *
                                                                        lote.price
                                                                    }
                                                                    displayType="text"
                                                                    thousandSeparator
                                                                    prefix="R$"
                                                                    renderText={(
                                                                        value
                                                                    ) => value}
                                                                    decimalScale={
                                                                        2
                                                                    }
                                                                />
                                                            </Text>
                                                        </TableCell>
                                                    )}
                                            </TableRow>
                                        );
                                    })}
                                </Table>
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
