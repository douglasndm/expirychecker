import React from 'react';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format, formatDistanceToNow } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import {
    Container,
    Card,
    ProductDetails,
    ProductDetailsContainer,
    ProductName,
    ProductCode,
    ProductLote,
    ProductExpDate,
    AmountContainer,
    AmountContainerText,
    Amount,
} from './styles';

interface Request {
    product: {
        id: number;
        name: string;
        code?: string;
        lotes: []
    }

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const navigation = useNavigation();

    const theme = useTheme();

    const expiredOrNext = expired || nextToExp ? true : false;

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                expired={expired}
                nextToExp={nextToExp}
            >
                <ProductDetails>
                    <ProductDetailsContainer>
                        <ProductName expiredOrNext={expiredOrNext}>
                            {product.name}
                        </ProductName>
                        {product.code &&
                            <ProductCode expiredOrNext={expiredOrNext}>
                                Código: {product.code}
                            </ProductCode>
                        }

                        {product.lotes[0].lote ? (
                            <ProductLote expiredOrNext={expiredOrNext}>
                                Lote: {product.lotes[0].lote}
                            </ProductLote>
                        ) : null}
                    </ProductDetailsContainer>

                    {product.lotes[0].amount &&
                    product.lotes[0].amount !== '' ? (
                        <AmountContainer>
                            <AmountContainerText expiredOrNext={expiredOrNext}>
                                Quantidade
                            </AmountContainerText>
                            <Amount expiredOrNext={expiredOrNext}>
                                {product.lotes[0].amount}
                            </Amount>
                        </AmountContainer>
                    ) : null}
                </ProductDetails>

                <ProductExpDate expiredOrNext={expiredOrNext}>
                    {expired ? 'Venceu ' : 'Vence '}
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

export default React.memo(Product);
