import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import AsyncStorange from '@react-native-community/async-storage';
import { useNavigation, StackActions } from '@react-navigation/native';
import { FAB, Button, Dialog } from 'react-native-paper';
import { format, isPast, addDays, formatDistanceToNow } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';
import { sortLoteByExpDate } from '../../functions/lotes';

import {
    Container,
    PageHeader,
    ProductDetailsContainer,
    PageTitle,
    ProductName,
    ProductCode,
    InputText,
    CategoryDetails,
    CategoryDetailsText,
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
} from './styles';

async function getDaysToBeNext() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.log(err);
    }

    return 30;
}

export default ({ route, navigation }) => {
    const productId = route.params.id;

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    const [fabOpen, setFabOpen] = useState(false);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);
    const [edit, setEdit] = useState(false);

    const [daysToBeNext, setDaysToBeNext] = useState();

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNext();
            setDaysToBeNext(days);
        }

        getAppData();
    }, []);

    async function getProduct(realm) {
        try {
            const result = realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            setName(result.name);
            setCode(result.code);

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function startRealm() {
            const realm = await Realm();

            realm.addListener('change', () => {
                getProduct(realm);
            });

            getProduct(realm);
        }

        startRealm();
    }, []);

    async function updateProduct() {
        try {
            const realm = await Realm();

            realm.write(() => {
                realm.create(
                    'Product',
                    { id: productId, name, code },
                    'modified'
                );
            });
        } catch (err) {
            console.log(err);
        }
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
            <ScrollView>
                <Container>
                    <PageHeader>
                        <ProductDetailsContainer>
                            <PageTitle>Detalhes</PageTitle>

                            {edit ? (
                                <View>
                                    <InputText
                                        value={name}
                                        placeholder="Nome do produto"
                                        onChangeText={(value) => setName(value)}
                                    />
                                    <InputText
                                        value={code}
                                        placeholder="Código do produto"
                                        onChangeText={(value) => setCode(value)}
                                    />
                                </View>
                            ) : (
                                <View>
                                    <ProductName>{name}</ProductName>
                                    <ProductCode>Código: {code}</ProductCode>
                                </View>
                            )}
                        </ProductDetailsContainer>

                        {edit ? (
                            <View>
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
                                        setEdit(false);
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
                                        setEdit(false);
                                    }}
                                >
                                    Cancelar
                                </Button>
                            </View>
                        ) : (
                            <View>
                                <Button
                                    icon={() => (
                                        <Ionicons
                                            name="create-outline"
                                            color="black"
                                            size={22}
                                        />
                                    )}
                                    color="#14d48f"
                                    onPress={() => setEdit(true)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    icon={() => (
                                        <Ionicons
                                            name="trash-outline"
                                            color="black"
                                            size={22}
                                        />
                                    )}
                                    color="#14d48f"
                                    onPress={() => {
                                        setDeleteComponentVisible(true);
                                    }}
                                >
                                    Apagar
                                </Button>
                            </View>
                        )}
                    </PageHeader>

                    <CategoryDetails>
                        <CategoryDetailsText>
                            Todos os lotes cadastrados
                        </CategoryDetailsText>
                    </CategoryDetails>

                    <Table style={{ backgroundColor: '#fff' }}>
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

                            if (vencido) bgColor = '#CC4B4B';
                            else if (proximo) bgColor = '#DDE053';

                            return (
                                <TableRow
                                    key={lote.id}
                                    bgcolor={bgColor}
                                    onPress={() => {
                                        navigation.jumpTo('EditLote', {
                                            productId,
                                            loteId: lote.id,
                                        });
                                    }}
                                >
                                    <TableCell>{lote.lote}</TableCell>
                                    <TableCell>
                                        {format(lote.exp_date, 'dd/MM/yyyy', {
                                            locale: br,
                                        })}
                                    </TableCell>
                                    <TableCell numeric>{lote.amount}</TableCell>
                                    <TableCell>{lote.status}</TableCell>
                                </TableRow>
                            );
                        })}
                    </Table>
                </Container>
            </ScrollView>

            <Dialog
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <Dialog.Title>Você tem certeza?</Dialog.Title>
                <Dialog.Content>
                    <Text>
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
                        color="#14d48f"
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
                        icon: () => (
                            <Ionicons name="add" size={24} color="#14d48f" />
                        ),
                        label: 'Adicionar novo lote',
                        onPress: () => {
                            navigation.navigate('AddLote', { productId });
                        },
                    },
                ]}
                icon={() => <Ionicons name="reader" size={24} color="#FFF" />}
                open={fabOpen}
                onStateChange={() => setFabOpen(!fabOpen)}
                visible
                onPress={() => setFabOpen(!fabOpen)}
                fabStyle={{ backgroundColor: '#14d48f' }}
            />
        </>
    );
};
