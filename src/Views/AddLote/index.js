import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { ProductHeader, ProductName, ProductCode } from './styles';

const AddLote = ({ route }) => {
    const { productId } = route.params;
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());

    async function handleSave() {
        const realm = await Realm();

        try {
            const result = realm
                .objects('Product')
                .filtered(`id == ${productId}`)[0];

            const lastLote = realm.objects('Lote').sorted('id', true)[0];
            const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

            await realm.write(() => {
                result.lotes.push({
                    id: nextLoteId,
                    lote,
                    amount: parseInt(amount),
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
        <Container>
            <ScrollView>
                <PageTitle>Adicionar um lote</PageTitle>

                <InputContainer>
                    <ProductHeader>
                        <ProductName>{name}</ProductName>
                        <ProductCode>{code}</ProductCode>
                    </ProductHeader>

                    <InputGroup>
                        <InputText
                            placeholder="Lote"
                            value={lote}
                            onChangeText={(value) => setLote(value)}
                            style={{ flex: 3, marginRight: 5 }}
                        />
                        <InputText
                            style={{ flex: 2 }}
                            placeholder="Quantidade"
                            keyboardType="numeric"
                            value={String(amount)}
                            onChangeText={(value) => setAmount(value)}
                        />
                    </InputGroup>

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
                <Button onPress={() => handleSave()}>
                    <ButtonText>Salvar</ButtonText>
                </Button>
            </ScrollView>
        </Container>
    );
};

export default AddLote;
