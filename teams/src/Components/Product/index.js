import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, isPast, formatDistanceToNow } from 'date-fns';
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
    const vencido = isPast(product.lotes[0].exp_date, new Date());

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                vencido={vencido}
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

                <ProductExpDate vencido={vencido}>
                    {vencido ? 'Venceu ' : 'Vence '}
                    {formatDistanceToNow(product.lotes[0].exp_date, {
                        addSuffix: true,
                        locale: br,
                    })}
                    {format(product.lotes[0].exp_date, ', EEEE, dd/MM/yyyy', {
                        locale: br,
                    })}
                </ProductExpDate>
            </Card>
        </Container>
    );
};
