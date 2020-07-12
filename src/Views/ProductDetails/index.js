import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, Alert } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { FAB, Button, Dialog } from 'react-native-paper';
import { format, isPast, addDays, formatDistanceToNow } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';

import {
    Container,
    PageHeader,
    PageTitle,
    ProductName,
    ProductCode,
    InputText,
    CategoryDetails,
    CategoryDetailsText,
    ProductLoteContainer,
    LoteContainer,
    LoteTitle,
    Lote,
    StatusContainer,
    StatusTitle,
    Status,
    AmountContainer,
    AmountTitleText,
    ProductAmount,
    ProductExpDate,
} from './styles';

export default ({ route }) => {
    const productId = route.params.id;

    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    const [fabOpen, setFabOpen] = useState(false);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);
    const [edit, setEdit] = useState(false);

    const [bgColor, setBgColor] = useState('#FFF');
    const [textColor, setTextColor] = useState('black');

    async function getProduct(realm) {
        try {
            const result = realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            setName(result.name);
            setCode(result.code);

            setLotes(result.lotes);
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
        const realm = await Realm();

        const prod = await realm
            .objects('Product')
            .filtered(`id == ${productId}`);

        try {
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
                        <View>
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
                        </View>

                        {edit ? (
                            <View>
                                <Button
                                    icon={() => (
                                        <Ionicons
                                            name="save-outline"
                                            color="black"
                                            size={14}
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
                                            size={14}
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
                                            size={14}
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
                                            size={14}
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

                    {lotes.map((lote) => {
                        const vencido = isPast(lote.exp_date, new Date());
                        const proximo = addDays(new Date(), 30) > lote.exp_date;

                        return (
                            <ProductLoteContainer key={lote.id}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <LoteContainer>
                                        <LoteTitle>LOTE</LoteTitle>
                                        <Lote>{lote.lote}</Lote>
                                    </LoteContainer>

                                    <StatusContainer>
                                        <StatusTitle>STATUS</StatusTitle>
                                        <Status>Tratado</Status>
                                    </StatusContainer>

                                    <AmountContainer>
                                        <AmountTitleText>
                                            QUANTIDADE
                                        </AmountTitleText>
                                        <ProductAmount>
                                            {lote.amount}
                                        </ProductAmount>
                                    </AmountContainer>
                                </View>

                                <ProductExpDate textColor={textColor}>
                                    {vencido ? 'Venceu ' : 'Vence '}
                                    {formatDistanceToNow(lote.exp_date, {
                                        addSuffix: true,
                                        locale: br,
                                    })}
                                    {format(
                                        lote.exp_date,
                                        ', EEEE, dd/MM/yyyy',
                                        {
                                            locale: br,
                                        }
                                    )}
                                </ProductExpDate>
                            </ProductLoteContainer>
                        );
                    })}
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
                        onPress={() => {
                            deleteProduct();
                        }}
                    >
                        APAGAR
                    </Button>
                    <Button
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
