import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { RadioButton, useTheme, Dialog, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';

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

import { ProductHeader, ProductName, ProductCode } from '../AddLote/styles';

const EditLote = ({ route, navigation }) => {
    const { productId, loteId } = route.params;

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [product, setProduct] = useState({});

    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());
    const [tratado, setTratado] = useState(false);

    async function handleSave() {
        const realm = await Realm();

        try {
            realm.write(() => {
                realm.create(
                    'Lote',
                    {
                        id: loteId,
                        lote,
                        amount: parseInt(amount),
                        exp_date: expDate,
                        status: tratado ? 'Tratado' : 'Não tratado',
                    },
                    'modified'
                );
            });

            Alert.alert('Lote editado!');
            navigation.goBack();
        } catch (err) {
            console.tron(err);
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
            const realm = await Realm();

            const result = await realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            setProduct(result);

            const resultLote = result.lotes.find((l) => l.id === loteId);

            const jaTratado = resultLote.status === 'Tratado';

            setLote(resultLote.lote);
            setAmount(resultLote.amount);
            setExpDate(resultLote.exp_date);
            setTratado(jaTratado);
        }

        getProduct();
    }, []);

    return (
        <>
            <Container style={{ backgroundColor: theme.colors.background }}>
                <ScrollView>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <PageTitle style={{ color: theme.colors.text }}>
                            Editar lote
                        </PageTitle>

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

                    <InputContainer>
                        <ProductHeader>
                            <ProductName style={{ color: theme.colors.text }}>
                                {product.name}
                            </ProductName>
                            <ProductCode style={{ color: theme.colors.text }}>
                                {product.code}
                            </ProductCode>
                        </ProductHeader>

                        <InputGroup>
                            <InputText
                                style={{
                                    flex: 3,
                                    marginRight: 5,
                                    backgroundColor:
                                        theme.colors.inputBackground,
                                    color: theme.colors.inputText,
                                }}
                                placeholder="Lote"
                                placeholderTextColor={theme.colors.subText}
                                value={lote}
                                onChangeText={(value) => setLote(value)}
                            />
                            <InputText
                                style={{
                                    flex: 2,
                                    backgroundColor:
                                        theme.colors.inputBackground,
                                    color: theme.colors.inputText,
                                }}
                                placeholder="Quantidade"
                                placeholderTextColor={theme.colors.subText}
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
                                    color="#14d48f"
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
                                    color="#14d48f"
                                />
                                <Text style={{ color: theme.colors.text }}>
                                    Não tratado
                                </Text>
                            </View>
                        </View>

                        <ExpDateGroup>
                            <ExpDateLabel
                                style={{ color: theme.colors.subText }}
                            >
                                Data de vencimento
                            </ExpDateLabel>
                            <CustomDatePicker
                                style={{
                                    backgroundColor:
                                        theme.colors.productBackground,
                                }}
                                textColor={theme.colors.inputText}
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

                    <GenericButton text="Salvar" onPress={() => handleSave()} />
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
