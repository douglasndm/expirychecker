import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { getDay, getMonth, getYear, format } from 'date-fns';

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

const AddProduct = () => {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState('');

    const [expDate, setExpDate] = useState(new Date());

    function updateDate(date) {
        setExpDate();
    }

    return (
        <Container>
            <ScrollView>
                <PageTitle>Adicionar um novo produto</PageTitle>

                <Text>
                    {name} - {code} - {lote} - {amount} - {String(expDate)}
                </Text>
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
                <Button>
                    <ButtonText>Salvar</ButtonText>
                </Button>
            </ScrollView>
        </Container>
    );
};

export default AddProduct;
