import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import Realm from '../../Services/Realm';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
    Button,
    ButtonText,
} from '../AddProduct/styles';

import { ProductHeader, ProductName, ProductCode } from '../AddLote/styles';

const EditLote = ({ route, navigation }) => {
    const { productId, loteId } = route.params;

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
        <Container style={{ backgroundColor: theme.colors.background }}>
            <ScrollView>
                <PageTitle style={{ color: theme.colors.text }}>
                    Editar lote
                </PageTitle>

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
                                backgroundColor: theme.colors.inputBackground,
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
                                backgroundColor: theme.colors.inputBackground,
                                color: theme.colors.inputText,
                            }}
                            placeholder="Quantidade"
                            placeholderTextColor={theme.colors.subText}
                            keyboardType="numeric"
                            value={String(amount)}
                            onChangeText={(value) => setAmount(value)}
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
                                    tratado === true ? 'checked' : 'unchecked'
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
                                    tratado === !true ? 'checked' : 'unchecked'
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
                        <ExpDateLabel style={{ color: theme.colors.subText }}>
                            Data de vencimento
                        </ExpDateLabel>
                        <CustomDatePicker
                            style={{
                                backgroundColor: theme.colors.productBackground,
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
                <Button
                    onPress={() => handleSave()}
                    style={{ backgroundColor: theme.colors.accent }}
                >
                    <ButtonText>Salvar</ButtonText>
                </Button>
            </ScrollView>
        </Container>
    );
};

export default EditLote;
