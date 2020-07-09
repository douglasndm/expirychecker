import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import {
    Container,
    Card,
    ProductDetails,
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
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
            >
                <ProductDetails>
                    <View>
                        <ProductName>{product.name}</ProductName>
                        <ProductCode>Código: {product.code}</ProductCode>
                        <ProductLote>Lote: {product.lotes[0].lote}</ProductLote>
                    </View>

                    <AmountContainer>
                        <AmountContainerText>Quantidade</AmountContainerText>
                        <Amount>{product.lotes[0].amount}</Amount>
                    </AmountContainer>
                </ProductDetails>

                <ProductExpDate>
                    Vence em
                    {format(product.lotes[0].exp_date, ' EEEE, dd/MM/yyyy', {
                        locale: br,
                    })}
                </ProductExpDate>
            </Card>
        </Container>
    );
};
