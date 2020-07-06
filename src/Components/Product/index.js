import React from 'react';
import { View, Text } from 'react-native';

import {
    Container,
    Card,
    ProductName,
    ProductCode,
    ProductLote,
    ProductExpDate,
    AmountContainer,
    AmountContainerText,
    Amount,
    ButtonDetails,
    ButtonDetailsText,
} from './styles';

export default ({ product }) => {
    return (
        <Container>
            <Card>
                <View>
                    <ProductName>{product.name}</ProductName>
                    <ProductCode>Código: {product.barcode}</ProductCode>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductExpDate>Vence em {product.exp_date}</ProductExpDate>
                </View>
                <AmountContainer>
                    <AmountContainerText>Quantidade</AmountContainerText>
                    <Amount>{product.amount}</Amount>
                </AmountContainer>
            </Card>

            <ButtonDetails>
                <ButtonDetailsText>Detalhes</ButtonDetailsText>
            </ButtonDetails>
        </Container>
    );
};
