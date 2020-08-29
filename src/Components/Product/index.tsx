import React from 'react';
import { useNavigation } from '@react-navigation/native';
import br, { format, formatDistanceToNow } from 'date-fns';

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
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const navigation = useNavigation();

    const expiredOrNext = !!(expired || nextToExp);

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
                        {!!product.code && (
                            <ProductCode expiredOrNext={expiredOrNext}>
                                Código: {product.code}
                            </ProductCode>
                        )}

                        {!!product.lotes.length && (
                            <ProductLote expiredOrNext={expiredOrNext}>
                                Lote: {product.lotes[0].lote}
                            </ProductLote>
                        )}
                    </ProductDetailsContainer>

                    {!!product.lotes.length && (
                        <AmountContainer>
                            <AmountContainerText expiredOrNext={expiredOrNext}>
                                Quantidade
                            </AmountContainerText>
                            <Amount expiredOrNext={expiredOrNext}>
                                {product.lotes[0].amount}
                            </Amount>
                        </AmountContainer>
                    )}
                </ProductDetails>

                {!!product.lotes.length && (
                    <ProductExpDate expiredOrNext={expiredOrNext}>
                        {expired ? 'Venceu ' : 'Vence '}
                        {formatDistanceToNow(product.lotes[0].exp_date, {
                            addSuffix: true,
                            locale: br,
                        })}
                        {format(
                            product.lotes[0].exp_date,
                            ', EEEE, dd/MM/yyyy',
                            {
                                locale: br,
                            }
                        )}
                    </ProductExpDate>
                )}
            </Card>
        </Container>
    );
};

export default React.memo(Product);
