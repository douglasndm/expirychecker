import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import crashlytics from '@react-native-firebase/crashlytics';
import { useTheme } from 'styled-components';

import GenericButton from '../../Components/Button';
import Notification from '../../Components/Notification';

import { createLote } from '../../Functions/Lotes';
import { getProductById } from '../../Functions/Product';

import {
    Container,
    PageTitle,
    InputContainer,
    InputText,
    NumericInputField,
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
    const [notification, setNotification] = useState<string>();

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());

    const handleSave = useCallback(async () => {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }
        try {
            await createLote({
                productId,
                lote: {
                    lote,
                    amount,
                    exp_date: expDate,
                    price,
                },
            });

            Alert.alert('Lote cadastrado com sucesso');
            navigation.goBack();
        } catch (err) {
            crashlytics().recordError(err);
            setNotification(err);
        }
    }, [amount, productId, expDate, lote, navigation, price]);

    useEffect(() => {
        async function getProduct() {
            const prod = await getProductById(productId);

            if (prod) {
                setName(prod.name);

                if (prod.code) setCode(prod.code);
            }
        }
        getProduct();
    }, [productId]);

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
                            onChangeText={(value) => {
                                const regex = /^[0-9\b]+$/;

                                if (value === '' || regex.test(value)) {
                                    if (value === '') {
                                        setAmount(0);
                                        return;
                                    }
                                    setAmount(Number(value));
                                }
                            }}
                        />
                    </InputGroup>

                    <NumericInputField
                        type="currency"
                        locale="pt-BR"
                        currency="BRL"
                        value={price}
                        onUpdate={(value: number) => setPrice(value)}
                        placeholder="Valor unitário"
                    />

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

            {!!notification && (
                <Notification
                    NotificationMessage={notification}
                    NotificationType="error"
                />
            )}
        </Container>
    );
};

export default AddLote;
