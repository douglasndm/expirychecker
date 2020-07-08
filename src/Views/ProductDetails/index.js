import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import {
    Container,
    PageTitle,
    ProductName,
    ProductCode,
    CategoryDetails,
    CategoryDetailsText,
    ProductLoteContainer,
    ProductLote,
    ProductAmount,
    ProductExpDate,
} from './styles';

export default (props) => {
    const { product } = props.route.params;

    return (
        <ScrollView>
            <Container>
                <PageTitle>Detalhes</PageTitle>
                <ProductName>{product.name}</ProductName>
                <ProductCode>{product.code}</ProductCode>

                <CategoryDetails>
                    <CategoryDetailsText>
                        Todos os lotes cadastrados
                    </CategoryDetailsText>
                </CategoryDetails>

                <ProductLoteContainer
                    style={aditionalStylesForProductContainer.container}
                >
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>

                <ProductLoteContainer>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>

                <ProductLoteContainer>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>

                <ProductLoteContainer>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>

                <ProductLoteContainer>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>

                <ProductLoteContainer>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductAmount>Quantidade: {product.amount}</ProductAmount>

                    <ProductExpDate>
                        Vence em 24 de abril de 2019
                    </ProductExpDate>
                </ProductLoteContainer>
            </Container>
        </ScrollView>
    );
};

const aditionalStylesForProductContainer = StyleSheet.create({
    container: {
        elevation: 4,
    },
});
