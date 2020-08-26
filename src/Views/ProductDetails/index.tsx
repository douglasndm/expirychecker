import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components/native';
import { FAB, Button } from 'react-native-paper';
import br, { format, isPast, addDays } from 'date-fns';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';

import GenericButton from '../../Components/Button';

import { getDaysToBeNextToExp } from '../../Functions/Settings';
import { getProductById } from '../../Functions/Product';
import { sortLoteByExpDate } from '../../Functions/Lotes';

import {
    Container,
    PageHeader,
    ProductDetailsContainer,
    PageTitle,
    ProductName,
    ProductCode,
    ButtonPaper,
    Icons,
    CategoryDetails,
    CategoryDetailsText,
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
    Text,
    DialogPaper,
} from './styles';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const navigation = useNavigation();

    const productId = route.params.id;

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    const [fabOpen, setFabOpen] = useState(false);
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [daysToBeNext, setDaysToBeNext] = useState<number>();

    const getProduct = useCallback(async () => {
        try {
            const result = await getProductById(productId);

            if (!result || result === null) {
                crashlytics().log(
                    `Product retornou null da função. ID: ${productId}`
                );
                console.log(
                    `Product retornou null da função. ID: ${productId}`
                );
                return;
            }

            setName(result.name);
            setCode(result.code);

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (error) {
            crashlytics().recordError(error);
            console.warn(error);
        }
    }, [productId]);

    const handleEdit = useCallback(() => {
        navigation.push('EditProduct', { productId });
    }, []);

    const deleteProduct = useCallback(async () => {
        const realm = await Realm();

        const prod = await realm
            .objects('Product')
            .filtered(`id == ${productId}`);

        try {
            realm.write(async () => {
                await realm.delete(prod);

                Alert.alert(`${name} foi apagado.`);
                navigation.dispatch(StackActions.popToTop());
            });
        } catch (err) {
            console.log(err);
        }
    }, [name, productId, navigation]);

    useEffect(() => {
        getDaysToBeNextToExp().then((response) => setDaysToBeNext(response));
    }, []);

    useEffect(() => {
        let realm: Realm;

        async function startRealm() {
            realm = await Realm();

            realm.addListener('change', () => {
                getProduct();
            });

            getProduct();
        }

        startRealm();

        return () => {
            realm.removeAllListeners();
        };
    }, []);

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
                                    compact
                                    onPress={() => {
                                        navigation.goBack();
                                    }}
                                />
                                <PageTitle>Detalhes</PageTitle>
                            </View>

                            <View>
                                <ProductName>{name}</ProductName>
                                <ProductCode>Código: {code}</ProductCode>
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

                    <CategoryDetails>
                        <CategoryDetailsText>
                            Todos os lotes cadastrados
                        </CategoryDetailsText>
                    </CategoryDetails>

                    <Table>
                        <TableHeader>
                            <TableTitle>LOTE</TableTitle>
                            <TableTitle>VENCIMENTO</TableTitle>
                            <TableTitle>QUANTIDADE</TableTitle>
                            <TableTitle>STATUS</TableTitle>
                        </TableHeader>

                        {lotes.map((lote) => {
                            const expired = isPast(lote.exp_date, new Date());
                            const nextToExp =
                                addDays(new Date(), daysToBeNext) >
                                lote.exp_date;

                            const expiredOrNext = !!(expired || nextToExp);

                            return (
                                <TableRow
                                    key={lote.id}
                                    expired={expired}
                                    nextToExp={nextToExp}
                                    onPress={() => {
                                        navigation.push('EditLote', {
                                            productId,
                                            loteId: lote.id,
                                        });
                                    }}
                                >
                                    <TableCell>
                                        <Text expiredOrNext={expiredOrNext}>
                                            {lote.lote}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text expiredOrNext={expiredOrNext}>
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
                                        <Text expiredOrNext={expiredOrNext}>
                                            {lote.amount}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text expiredOrNext={expiredOrNext}>
                                            {lote.status
                                                ? lote.status
                                                : 'Não tratado'}
                                        </Text>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </Table>

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

            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title>Você tem certeza?</DialogPaper.Title>
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

            <FAB.Group
                actions={[
                    {
                        style: {
                            backgroundColor: theme.colors.accent,
                        },
                        icon: () => (
                            <Ionicons name="add" size={24} color="#FFFFFF" />
                        ),
                        onPress: () => {
                            navigation.push('AddLote', { productId });
                        },
                    },
                ]}
                icon={() => <Ionicons name="reader" size={24} color="#FFF" />}
                open={fabOpen}
                onStateChange={() => setFabOpen(!fabOpen)}
                visible
                onPress={() => setFabOpen(!fabOpen)}
                fabStyle={{ backgroundColor: theme.colors.accent }}
                color={theme.colors.accent}
            />
        </>
    );
};

export default ProductDetails;
