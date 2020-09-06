import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { RadioButton, Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';

import Realm from '../../Services/Realm';

import { getProductById } from '../../Functions/Product';
import { deleteLote } from '../../Functions/Lotes';

import GenericButton from '../../Components/Button';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '../AddProduct/styles';

import { Button, Icons } from './styles';

import { ProductHeader, ProductName, ProductCode } from '../AddLote/styles';

interface EditLoteProps {
    route: {
        params: {
            productId: number;
            loteId: number;
        };
    };
}

const EditLote: React.FC<EditLoteProps> = ({ route }: EditLoteProps) => {
    const { productId, loteId } = route.params;

    const navigation = useNavigation();

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [product, setProduct] = useState({});

    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());
    const [tratado, setTratado] = useState(false);

    async function handleSave() {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }

        try {
            Realm.write(() => {
                const loteAmount =
                    amount.trim() !== '' ? parseInt(amount) : null;

                Realm.create(
                    'Lote',
                    {
                        id: loteId,
                        lote,
                        amount: loteAmount,
                        exp_date: expDate,
                        status: tratado ? 'Tratado' : 'Não tratado',
                    },
                    'modified'
                );
            });

            Alert.alert('Lote editado!');
            navigation.goBack();
        } catch (err) {
            console.warn(err);
        }
    }

    async function handleDelete() {
        try {
            await deleteLote(loteId);

            Alert.alert(`O lote ${lote} foi apagado.`);
            navigation.dispatch(StackActions.popToTop());
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        async function getProduct() {
            const p = await getProductById(productId);

            setProduct(p);

            const resultLote = p.lotes.find((l) => l.id === loteId);

            const jaTratado = resultLote.status === 'Tratado';

            const regex = /^[0-9\b]+$/;
            if (resultLote.amount === '' || regex.test(resultLote.amount)) {
                setAmount(String(resultLote.amount));
            }

            setLote(resultLote.lote);
            setExpDate(resultLote.exp_date);
            setTratado(jaTratado);
        }

        getProduct();
    }, []);

    return (
        <>
            <Container>
                <ScrollView>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
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
                                    />
                                )}
                                compact
                                onPress={() => {
                                    navigation.goBack();
                                }}
                            />
                            <PageTitle>Editar lote</PageTitle>
                        </View>

                        <Button
                            icon={() => (
                                <Icons name="trash-outline" size={22} />
                            )}
                            onPress={() => {
                                setDeleteComponentVisible(true);
                            }}
                        >
                            Apagar
                        </Button>
                    </View>

                    <InputContainer>
                        <ProductHeader>
                            <ProductName>{product.name}</ProductName>
                            <ProductCode>{product.code}</ProductCode>
                        </ProductHeader>

                        <InputGroup>
                            <InputText
                                style={{
                                    flex: 5,
                                    marginRight: 5,
                                }}
                                placeholder="Lote"
                                value={lote}
                                onChangeText={(value) => setLote(value)}
                            />
                            <InputText
                                style={{
                                    flex: 4,
                                }}
                                placeholder="Quantidade"
                                keyboardType="numeric"
                                value={String(amount)}
                                onChangeText={(v) => {
                                    const regex = /^[0-9\b]+$/;

                                    if (v === '' || regex.test(v)) {
                                        setAmount(v);
                                    }
                                }}
                            />
                        </InputGroup>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <RadioButton
                                    value="tratado"
                                    status={
                                        tratado === true
                                            ? 'checked'
                                            : 'unchecked'
                                    }
                                    onPress={() => setTratado(true)}
                                    color={theme.colors.accent}
                                />
                                <Text style={{ color: theme.colors.text }}>
                                    Tratado
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <RadioButton
                                    value="Não tratado"
                                    status={
                                        tratado === !true
                                            ? 'checked'
                                            : 'unchecked'
                                    }
                                    onPress={() => setTratado(false)}
                                    color={theme.colors.accent}
                                />
                                <Text style={{ color: theme.colors.text }}>
                                    Não tratado
                                </Text>
                            </View>
                        </View>

                        <ExpDateGroup>
                            <ExpDateLabel>Data de vencimento</ExpDateLabel>
                            <CustomDatePicker
                                date={expDate}
                                onDateChange={(value) => {
                                    setExpDate(value);
                                }}
                                fadeToColor="none"
                                mode="date"
                                locale="pt-br"
                            />
                        </ExpDateGroup>
                    </InputContainer>

                    <GenericButton text="Salvar" onPress={handleSave} />
                </ScrollView>
            </Container>

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
                        Se continuar você irá apagar este lote
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button color="red" onPress={handleDelete}>
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
        </>
    );
};

export default EditLote;
