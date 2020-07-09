import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import Realm from '../../Services/Realm';

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
    const productId = props.route.params.product.id;

    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    const [lotes, setLotes] = useState([]);

    useEffect(() => {
        async function getProduct() {
            const realm = await Realm();

            try {
                const result = realm
                    .objects('Product')
                    .filtered(`id == ${productId}`)[0];

                setName(result.name);
                setCode(result.code);

                setLotes(result.lotes);
            } catch (error) {
                console.log(error);
            }
        }

        getProduct();
    }, []);

    return (
        <ScrollView>
            <Container>
                <PageTitle>Detalhes</PageTitle>
                <ProductName>{name}</ProductName>
                <ProductCode>{code}</ProductCode>

                <CategoryDetails>
                    <CategoryDetailsText>
                        Todos os lotes cadastrados
                    </CategoryDetailsText>
                </CategoryDetails>

                {lotes.map((lote) => (
                    <ProductLoteContainer
                        key={lote.id}
                        style={aditionalStylesForProductContainer.container}
                    >
                        <ProductLote>Lote: {lote.lote}</ProductLote>
                        <ProductAmount>Quantidade: {lote.amount}</ProductAmount>

                        <ProductExpDate>
                            Vence em
                            {format(lote.exp_date, ' EEEE, dd/MM/yyyy', {
                                locale: br,
                            })}
                        </ProductExpDate>
                    </ProductLoteContainer>
                ))}
            </Container>
        </ScrollView>
    );
};

const aditionalStylesForProductContainer = StyleSheet.create({
    container: {
        elevation: 2,
    },
});
