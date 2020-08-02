import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from 'react-native-paper';

import GenericButton from '../../Components/Button';

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
} from '../AddProduct/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';

const AddLote = ({ route }) => {
    const { productId } = route.params;
    const navigation = useNavigation();

    const theme = useTheme();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());

    async function handleSave() {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }

        const realm = await Realm();

        try {
            const result = realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            const lastLote = realm.objects('Lote').sorted('id', true)[0];
            const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

            const loteAmount = amount.trim() !== '' ? parseInt(amount) : null;

            await realm.write(() => {
                result.lotes.push({
                    id: nextLoteId,
                    lote,
                    amount: loteAmount,
                    exp_date: expDate,
                });
            });

            Alert.alert('Lote cadastrado com sucesso');
            navigation.goBack();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        async function getProduct() {
            const realm = await Realm();

            const result = realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            setName(result.name);
            setCode(result.code);
        }
        getProduct();
    }, []);

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <ScrollView>
                <PageTitle style={{ color: theme.colors.text }}>
                    Adicionar um lote
                </PageTitle>

                <InputContainer>
                    <ProductHeader>
                        <ProductName style={{ color: theme.colors.text }}>
                            {name}
                        </ProductName>
                        <ProductCode style={{ color: theme.colors.text }}>
                            {code}
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
                            onChangeText={(v) => {
                                const regex = /^[0-9\b]+$/;

                                if (v === '' || regex.test(v)) {
                                    setAmount(v);
                                }
                            }}
                        />
                    </InputGroup>

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

                <GenericButton text="Salvar" onPress={() => handleSave()} />
            </ScrollView>
        </Container>
    );
};

export default AddLote;
