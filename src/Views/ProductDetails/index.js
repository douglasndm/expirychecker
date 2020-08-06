import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { FAB, Button, Dialog, useTheme } from 'react-native-paper';
import { format, isPast, addDays } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

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
    CategoryDetails,
    CategoryDetailsText,
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
} from './styles';

export default ({ route, navigation }) => {
    const productId = route.params.id;

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    const [fabOpen, setFabOpen] = useState(false);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [daysToBeNext, setDaysToBeNext] = useState();

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNextToExp();
            setDaysToBeNext(days);
        }

        getAppData();
    }, []);

    async function getProduct() {
        try {
            const result = await getProductById(productId);

            setName(result.name);
            setCode(result.code);

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        let realm;

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

    async function handleEdit() {
        navigation.push('EditProduct', { productId });
    }

    async function deleteProduct() {
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
    }

    return (
        <>
            <ScrollView style={{ backgroundColor: theme.colors.background }}>
                <Container>
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
                                        <Ionicons
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
                                <PageTitle style={{ color: theme.colors.text }}>
                                    Detalhes
                                </PageTitle>
                            </View>

                            <View>
                                <ProductName
                                    style={{ color: theme.colors.text }}
                                >
                                    {name}
                                </ProductName>
                                <ProductCode
                                    style={{ color: theme.colors.text }}
                                >
                                    Código: {code}
                                </ProductCode>
                            </View>
                        </ProductDetailsContainer>

                        <View>
                            <Button
                                icon={() => (
                                    <Ionicons
                                        name="create-outline"
                                        color={theme.colors.text}
                                        size={22}
                                    />
                                )}
                                color={theme.colors.accent}
                                onPress={() => handleEdit()}
                            >
                                Editar
                            </Button>
                            <Button
                                icon={() => (
                                    <Ionicons
                                        name="trash-outline"
                                        color={theme.colors.text}
                                        size={22}
                                    />
                                )}
                                color={theme.colors.accent}
                                onPress={() => {
                                    setDeleteComponentVisible(true);
                                }}
                            >
                                Apagar
                            </Button>
                        </View>
                    </PageHeader>

                    <CategoryDetails>
                        <CategoryDetailsText
                            style={{ color: theme.colors.accent }}
                        >
                            Todos os lotes cadastrados
                        </CategoryDetailsText>
                    </CategoryDetails>

                    <Table
                        style={{
                            backgroundColor: theme.colors.productBackground,
                        }}
                    >
                        <TableHeader>
                            <TableTitle>LOTE</TableTitle>
                            <TableTitle>VENCIMENTO</TableTitle>
                            <TableTitle>QUANTIDADE</TableTitle>
                            <TableTitle>STATUS</TableTitle>
                        </TableHeader>

                        {lotes.map((lote) => {
                            const vencido = isPast(lote.exp_date, new Date());
                            const proximo =
                                addDays(new Date(), daysToBeNext) >
                                lote.exp_date;

                            let bgColor = null;
                            let foreground = null;

                            if (vencido) {
                                bgColor = theme.colors.productExpiredBackground;
                                foreground = '#FFFFFF';
                            } else if (proximo) {
                                bgColor =
                                    theme.colors.productNextToExpBackground;
                                foreground = '#FFFFFF';
                            } else {
                                bgColor = theme.colors.productBackground;

                                foreground = theme.colors.text;
                            }

                            return (
                                <TableRow
                                    key={lote.id}
                                    style={{ backgroundColor: bgColor }}
                                    onPress={() => {
                                        navigation.push('EditLote', {
                                            productId,
                                            loteId: lote.id,
                                        });
                                    }}
                                >
                                    <TableCell>
                                        <Text style={{ color: foreground }}>
                                            {lote.lote}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text style={{ color: foreground }}>
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
                                            style={{
                                                color: foreground,
                                            }}
                                        >
                                            {lote.amount}
                                        </Text>
                                    </TableCell>
                                    <TableCell>
                                        <Text style={{ color: foreground }}>
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
                </Container>
            </ScrollView>

            <Dialog
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <Dialog.Title>Você tem certeza?</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ color: theme.colors.text }}>
                        Se continuar você irá apagar o produto e todos os seus
                        lotes
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
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
                </Dialog.Actions>
            </Dialog>

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
