import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
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
} from './styles';

const AddProduct = ({ navigation }) => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());

    async function handleSave() {
        const realm = await Realm();

        try {
            // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
            // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
            const lastProduct = realm.objects('Product').sorted('id', true)[0];
            const nextProductId = lastProduct == null ? 1 : lastProduct.id + 1;

            const lastLote = realm.objects('Lote').sorted('id', true)[0];
            const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

            realm.write(() => {
                const productResult = realm.create('Product', {
                    id: nextProductId,
                    name,
                    code,
                });

                const resultLote = productResult.lotes.push({
                    id: nextLoteId,
                    lote,
                    exp_date: expDate,
                    amount: parseInt(amount),
                });

                Alert.alert('Produto cadastrado.');
                navigation.navigate('Home');
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <ScrollView>
                <PageTitle>Adicionar um novo produto</PageTitle>

                <InputContainer>
                    <InputText
                        placeholder="Nome do produto"
                        value={name}
                        onChangeText={(value) => {
                            setName(value);
                        }}
                    />
                    <InputText
                        placeholder="Código"
                        value={code}
                        onChangeText={(value) => setCode(value)}
                    />

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

export default AddProduct;
