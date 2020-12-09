import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RadioButton, Dialog } from 'react-native-paper';
import { useTheme } from 'styled-components';

import { updateLote, deleteLote } from '../../Functions/Lotes';
import { getProductById } from '../../Functions/Product';

import Loading from '../../Components/Loading';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import {
    Container,
    PageTitle,
    PageContent,
    InputContainer,
    InputText,
    NumericInputField,
    InputGroup,
    ExpDateGroup,
    ExpDateLabel,
    CustomDatePicker,
} from '../AddProduct/styles';
import { ProductHeader, ProductName, ProductCode } from '../AddLote/styles';

import {
    LoadingText,
    PageHeader,
    PageTitleContainer,
    Button,
    Icons,
} from './styles';

interface EditLoteProps {
    productId: number;
    loteId: number;
}

const EditLote: React.FC = () => {
    const route = useRoute();
    const { reset, goBack } = useNavigation();

    const routeParams = route.params as EditLoteProps;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [product, setProduct] = useState<IProduct | null>(null);

    const productId = useMemo(() => {
        return routeParams.productId;
    }, [routeParams]);

    const loteId = useMemo(() => {
        return routeParams.loteId;
    }, [routeParams]);

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const theme = useTheme();

    const [lote, setLote] = useState('');
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(0);

    const [expDate, setExpDate] = useState(new Date());
    const [tratado, setTratado] = useState(false);

    useEffect(() => {
        async function getData() {
            setIsLoading(true);

            const response = await getProductById(productId);
            setProduct(response);

            if (!response) return;

            const loteResult = response.lotes.find((l) => l.id === loteId);

            if (!loteResult) {
                throw new Error('Lote não encontrado!');
            }

            const loteStatus = loteResult.status === 'Tratado';

            setLote(loteResult.lote);
            setExpDate(loteResult.exp_date);
            setTratado(loteStatus);

            if (loteResult.amount) setAmount(loteResult.amount);
            if (loteResult.price) setPrice(loteResult.price);
            setIsLoading(false);
        }

        getData();
    }, [productId, loteId]);

    async function handleSave() {
        if (!lote || lote.trim() === '') {
            Alert.alert('Digite o nome do lote');
            return;
        }

        try {
            await updateLote({
                id: loteId,
                lote,
                amount,
                exp_date: expDate,
                price,
                status: tratado ? 'Tratado' : 'Não tratado',
            });

            Alert.alert('Lote editado!');
            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'ProductDetails', params: { id: productId } },
                ],
            });
        } catch (err) {
            console.warn(err);
        }
    }

    const handleDelete = useCallback(async () => {
        try {
            await deleteLote(loteId);

            reset({
                index: 1,
                routes: [
                    { name: 'Home' },
                    { name: 'Success', params: { type: 'delete_batch' } },
                ],
            });
        } catch (err) {
            throw new Error(err);
        }
    }, [loteId, reset]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {!product ? (
                <LoadingText>Carregando</LoadingText>
            ) : (
                <Container>
                    <ScrollView>
                        <PageHeader>
                            <PageTitleContainer>
                                <BackButton handleOnPress={goBack} />
                                <PageTitle>Editar lote</PageTitle>
                            </PageTitleContainer>

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
                        </PageHeader>

                        <PageContent>
                            <InputContainer>
                                <ProductHeader>
                                    <ProductName>{product.name}</ProductName>
                                    {!!product.code && (
                                        <ProductCode>
                                            {product.code}
                                        </ProductCode>
                                    )}
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

                                            if (
                                                value === '' ||
                                                regex.test(value)
                                            ) {
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
                                    onUpdate={(value: number) =>
                                        setPrice(value)
                                    }
                                    placeholder="Valor unitário"
                                />

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
                                        <Text
                                            style={{ color: theme.colors.text }}
                                        >
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
                                        <Text
                                            style={{ color: theme.colors.text }}
                                        >
                                            Não tratado
                                        </Text>
                                    </View>
                                </View>

                                <ExpDateGroup>
                                    <ExpDateLabel>
                                        Data de vencimento
                                    </ExpDateLabel>
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
                        </PageContent>
                    </ScrollView>
                </Container>
            )}
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
