import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from 'styled-components';

import GenericButton from '../../Components/Button';

import Realm from '../../Services/Realm';
import { checkIfLoteAlreadyExists } from '../../Functions/Lotes';

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

interface AddLoteParams {
    route: {
        params: {
            productId: number;
        };
    };
}

const AddLote: React.FC<AddLoteParams> = ({ route }: AddLoteParams) => {
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

        if (await checkIfLoteAlreadyExists(lote, code)) {
            Alert.alert('Já existe um lote cadastrado para o mesmo produto');
            return;
        }

        try {
            const realm = await Realm();

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
        <Container>
            <ScrollView>
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: -15,
                    }}
                >
                    <ButtonPaper
                        style={{
                            alignSelf: 'flex-end',
                        }}
                        icon={() => (
                            <Ionicons
                                name="arrow-back-outline"
                                size={28}
                                color={theme.colors.text}
                            />
                        )}
                        compact
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <PageTitle>Adicionar um lote</PageTitle>
                </View>

                <InputContainer>
                    <ProductHeader>
                        <ProductName>{name}</ProductName>
                        <ProductCode>{code}</ProductCode>
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
    );
};

export default AddLote;
