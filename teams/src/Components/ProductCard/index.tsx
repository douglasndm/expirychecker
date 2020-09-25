import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format, formatDistanceToNow } from 'date-fns'; // eslint-disable-line
import br from 'date-fns/locale/pt-BR' // eslint-disable-line

import { getMultipleStores } from '../../Functions/Settings';

import {
    Container,
    Card,
    ProductDetails,
    ProductDetailsContainer,
    ProductName,
    ProductCode,
    ProductLote,
    ProductStore,
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
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const expiredOrNext = !!(expired || nextToExp);

    useEffect(() => {
        getMultipleStores().then((data) => {
            setMultipleStoresState(data);
        });
    }, []);

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

                        {!!product.lotes[0].lote && (
                            <ProductLote expiredOrNext={expiredOrNext}>
                                Lote: {product.lotes[0].lote}
                            </ProductLote>
                        )}

                        {multipleStoresState && !!product.store && (
                            <ProductStore expiredOrNext={expiredOrNext}>
                                Loja: {product.store}
                            </ProductStore>
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
