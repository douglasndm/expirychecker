import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

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
} from './styles';

export default ({ product }) => {
    const navigation = useNavigation();

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { product });
                }}
            >
                <View>
                    <ProductName>{product.name}</ProductName>
                    <ProductCode>Código: {product.code}</ProductCode>
                    <ProductLote>Lote: {product.lote}</ProductLote>
                    <ProductExpDate>
                        Vence em
                        {format(
                            parseISO(product.exp_date),
                            'EEEE, dd/MM/yyyy',
                            {
                                locale: br,
                            }
                        )}
                    </ProductExpDate>
                </View>
                <AmountContainer>
                    <AmountContainerText>Quantidade</AmountContainerText>
                    <Amount>{product.amount}</Amount>
                </AmountContainer>
            </Card>
        </Container>
    );
};
