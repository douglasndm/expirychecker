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

export default ({ product, expired, nextToExp }) => {
    const navigation = useNavigation();

    const theme = useTheme();

    let background;
    let foreground;

    if (expired) {
        background = theme.colors.productExpiredBackground;
        foreground = theme.colors.productNextOrExpiredText;
    } else if (nextToExp) {
        background = theme.colors.productNextToExpBackground;
        foreground = theme.colors.productNextOrExpiredText;
    } else {
        background = theme.colors.productBackground;
        foreground = theme.colors.text;
    }

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                style={{ backgroundColor: background }}
            >
                <ProductDetails>
                    <ProductDetailsContainer>
                        <ProductName style={{ color: foreground }}>
                            {product.name}
                        </ProductName>
                        <ProductCode style={{ color: foreground }}>
                            Código: {product.code}
                        </ProductCode>
                        <ProductLote style={{ color: foreground }}>
                            Lote: {product.lotes[0].lote}
                        </ProductLote>
                    </ProductDetailsContainer>

                    <AmountContainer>
                        <AmountContainerText style={{ color: foreground }}>
                            Quantidade
                        </AmountContainerText>
                        <Amount style={{ color: foreground }}>
                            {product.lotes[0].amount}
                        </Amount>
                    </AmountContainer>
                </ProductDetails>

                <ProductExpDate style={{ color: foreground }}>
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
