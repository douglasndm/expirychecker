import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import DatePicker from 'react-native-date-picker';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    Button,
    ButtonText,
} from './styles';

const AddProduct = () => {
    const [expDate, setExpDate] = useState(new Date());

    return (
        <Container>
            <ScrollView>
                <PageTitle>Adicionar um novo produto</PageTitle>
                <InputContainer>
                    <InputText placeholder="Nome do produto" />
                    <InputText placeholder="Código" />

                    <InputGroup>
                        <InputText
                            placeholder="Lote"
                            style={{ flex: 3, marginRight: 5 }}
                        />
                        <InputText
                            style={{ flex: 2 }}
                            placeholder="Quantidade"
                            keyboardType="numeric"
                        />
                    </InputGroup>

                    <ExpDateGroup>
                        <ExpDateLabel>Data de vencimento</ExpDateLabel>
                        <DatePicker
                            date={expDate}
                            onDateChange={setExpDate}
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
