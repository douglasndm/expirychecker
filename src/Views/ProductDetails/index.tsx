import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components';
import { Button } from 'react-native-paper';
import br, { format, isPast, addDays } from 'date-fns';
import NumberFormat from 'react-number-format';

import Ionicons from 'react-native-vector-icons/Ionicons';

import GenericButton from '../../Components/Button';

import {
    getDaysToBeNextToExp,
    getMultipleStores,
} from '../../Functions/Settings';
import { getProductById } from '../../Functions/Product';
import { sortLoteByExpDate } from '../../Functions/Lotes';

import {
    Container,
    PageHeader,
    ProductDetailsContainer,
    PageTitle,
    ProductName,
    ProductCode,
    ProductStore,
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

import RealmContext from '../../Contexts/RealmContext';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { Realm } = useContext(RealmContext);
    const navigation = useNavigation();

    const productId = route.params.id;

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [product, setProduct] = useState<IProduct>();

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [daysToBeNext, setDaysToBeNext] = useState<number>(0);

    const getProduct = useCallback(async () => {
        try {
            const result = await getProductById(productId);

            if (!result || result === null) {
                navigation.goBack();
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
    }, [productId, navigation]);

    const addNewLote = useCallback(() => {
        navigation.navigate('AddLote', { productId });
    }, [navigation, productId]);

    const handleEdit = useCallback(() => {
        navigation.push('EditProduct', { productId });
    }, [navigation, productId]);

    const deleteProduct = useCallback(async () => {
        const prod = Realm.objects('Product').filtered(`id == ${productId}`);

        try {
            Realm.write(async () => {
                Realm.delete(prod);

                Alert.alert(`${name} foi apagado.`);
                navigation.dispatch(StackActions.popToTop());
            });
        } catch (err) {
            console.log(err);
        }
    }, [name, productId, navigation]);

    useEffect(() => {
        getMultipleStores().then((data) => {
            setMultipleStoresState(data);
        });
    }, []);

    useEffect(() => {
        getDaysToBeNextToExp().then((response) => setDaysToBeNext(response));
    }, []);

    useEffect(() => {
        async function startRealm() {
            Realm.addListener('change', () => {
                getProduct();
            });

            getProduct();
        }

        startRealm();

        return () => Realm.removeAllListeners();
    }, []);

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
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginLeft: -15,
                                }}
                            >
                                <Button
                                    style={{
                                        alignSelf: 'flex-end',
                                    }}
                                    icon={() => (
                                        <Icons
                                            name="arrow-back-outline"
                                            size={28}
                                            color={theme.colors.text}
                                        />
                                    )}
                                    color={theme.colors.accent}
                                    compact
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                />
                                <PageTitle>Detalhes</PageTitle>
                            </View>

                            <View>
                                <ProductName>{name}</ProductName>
                                {!!code && (
                                    <ProductCode>Código: {code}</ProductCode>
                                )}
                                {multipleStoresState && !!product?.store && (
                                    <ProductStore>
                                        Loja: {product.store}
                                    </ProductStore>
                                )}
                            </View>
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
                                        addDays(new Date(), daysToBeNext) >
                                        lote.exp_date;

                                    const expiredOrNext = !!(
                                        expired || nextToExp
                                    );

                                    return (
                                        <TableRow
                                            key={lote.id}
                                            expired={expired}
                                            nextToExp={nextToExp}
                                            onPress={() => {
                                                navigation.push('EditLote', {
                                                    product,
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
                                                                decimalScale={2}
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
                                    const expired = isPast(lote.exp_date);
                                    const nextToExp =
                                        addDays(new Date(), daysToBeNext) >
                                        lote.exp_date;

                                    const expiredOrNext = !!(
                                        expired || nextToExp
                                    );

                                    return (
                                        <TableRow
                                            key={lote.id}
                                            expired={expired}
                                            nextToExp={nextToExp}
                                            onPress={() => {
                                                navigation.push('EditLote', {
                                                    product,
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
                                                                decimalScale={2}
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
                            navigation.push('AddLote', {
                                productId,
                            });
                        }}
                    />
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
                    <Button
                        color="red"
                        onPress={() => {
                            deleteProduct();
                        }}
                    >
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
