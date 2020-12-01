import React, { useState, useEffect, useContext, useMemo } from 'react';
import { PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, formatDistanceToNow } from 'date-fns'; // eslint-disable-line
import br from 'date-fns/locale/pt-BR' // eslint-disable-line
import NumberFormat from 'react-number-format';

import PreferencesContext from '../../Contexts/PreferencesContext';

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
    LoteDetailsContainer,
    AmountContainer,
    AmountContainerText,
    Amount,
    PriceContainer,
    PriceContainerText,
    Price,
} from './styles';

interface Request {
    product: IProduct;

    expired: boolean;
    nextToExp: boolean;
}
const Product = ({ product, expired, nextToExp }: Request) => {
    const navigation = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const [totalPrice, setTotalPrice] = useState(0);

    const exp_date = useMemo(() => {
        if (product.batches[0]) return new Date(product.batches[0].exp_date);
        return null;
    }, [product.batches]);

    const expiredOrNext = useMemo(() => {
        return !!(expired || nextToExp);
    }, [expired, nextToExp]);

    useEffect(() => {
        if (product.batches[0]) {
            if (product.batches[0].amount && product.batches[0].price) {
                setTotalPrice(
                    product.batches[0].price * product.batches[0].amount
                );
            }
        }
    }, [product]);

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

                        {product.batches.length > 0 &&
                            !!product.batches[0].name && (
                                <ProductLote expiredOrNext={expiredOrNext}>
                                    Lote: {product.batches[0].name}
                                </ProductLote>
                            )}

                        {userPreferences.multiplesStores && !!product.store && (
                            <ProductStore expiredOrNext={expiredOrNext}>
                                Loja: {product.store}
                            </ProductStore>
                        )}
                    </ProductDetailsContainer>

                    {product.batches.length > 0 && (
                        <LoteDetailsContainer>
                            <AmountContainer>
                                <AmountContainerText
                                    expiredOrNext={expiredOrNext}
                                >
                                    Quantidade
                                </AmountContainerText>
                                <Amount expiredOrNext={expiredOrNext}>
                                    {product.batches[0].amount}
                                </Amount>
                            </AmountContainer>

                            {PixelRatio.get() > 1 && totalPrice > 0 && (
                                <PriceContainer>
                                    <PriceContainerText
                                        expiredOrNext={expiredOrNext}
                                    >
                                        Preço total
                                    </PriceContainerText>
                                    <Price expiredOrNext={expiredOrNext}>
                                        <NumberFormat
                                            value={totalPrice}
                                            displayType="text"
                                            thousandSeparator
                                            prefix="R$"
                                            renderText={(value) => value}
                                            decimalScale={2}
                                        />
                                    </Price>
                                </PriceContainer>
                            )}
                        </LoteDetailsContainer>
                    )}
                </ProductDetails>

                {!!exp_date && (
                    <ProductExpDate expiredOrNext={expiredOrNext}>
                        {expired ? 'Venceu ' : 'Vence '}
                        {formatDistanceToNow(exp_date, {
                            addSuffix: true,
                            locale: br,
                        })}
                        {format(exp_date, ', EEEE, dd/MM/yyyy', {
                            locale: br,
                        })}
                    </ProductExpDate>
                )}
            </Card>
        </Container>
    );
};

export default React.memo(Product);
