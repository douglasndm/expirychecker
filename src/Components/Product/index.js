import React, { useState, useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format, isPast, formatDistanceToNow, addDays } from 'date-fns';
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

export default ({ product, daysToBeNext }) => {
    const navigation = useNavigation();
    const theme = useTheme();

    const [daysToConsiderNext, setDaysToConsiderNext] = useState(0);

    const vencido =
        product.lotes[0] && isPast(product.lotes[0].exp_date, new Date());
    const proximo =
        product.lotes[0] &&
        addDays(new Date(), daysToConsiderNext) > product.lotes[0].exp_date;

    const [bgColor, setBgColor] = useState(theme.colors.productBackground);
    const [textColor, setTextColor] = useState(theme.colors.text);

    useEffect(() => {
        setDaysToConsiderNext(daysToBeNext);
    }, [daysToBeNext]);

    useEffect(() => {
        if (vencido) {
            setBgColor(theme.colors.productExpiredBackground);
            setTextColor(theme.colors.productNextOrExpiredText);
        } else if (proximo) {
            setBgColor(theme.colors.productNextToExpBackground);
            setTextColor(theme.colors.productNextOrExpiredText);
        }
    }, [vencido, proximo]);

    return (
        <Container>
            <Card
                onPress={() => {
                    navigation.navigate('ProductDetails', { id: product.id });
                }}
                bgColor={bgColor}
            >
                <ProductDetails>
                    <ProductDetailsContainer>
                        <ProductName textColor={textColor}>
                            {product.name}
                        </ProductName>
                        <ProductCode textColor={textColor}>
                            Código: {product.code}
                        </ProductCode>
                        <ProductLote textColor={textColor}>
                            Lote: {product.lotes[0].lote}
                        </ProductLote>
                    </ProductDetailsContainer>

                    <AmountContainer>
                        <AmountContainerText textColor={textColor}>
                            Quantidade
                        </AmountContainerText>
                        <Amount textColor={textColor}>
                            {product.lotes[0].amount}
                        </Amount>
                    </AmountContainer>
                </ProductDetails>

                <ProductExpDate textColor={textColor}>
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
