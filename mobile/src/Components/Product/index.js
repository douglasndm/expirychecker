import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { format, isPast, formatDistanceToNow, addDays } from 'date-fns';
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

export default ({ product, daysToBeNext }) => {
    const navigation = useNavigation();

    const [daysToConsiderNext, setDaysToConsiderNext] = useState(0);

    const vencido = isPast(product.lotes[0].exp_date, new Date());
    const proximo =
        addDays(new Date(), daysToConsiderNext) > product.lotes[0].exp_date;

    const [bgColor, setBgColor] = useState('#FFF');
    const [textColor, setTextColor] = useState('black');

    useEffect(() => {
        setDaysToConsiderNext(daysToBeNext);
    }, [daysToBeNext]);

    useEffect(() => {
        if (vencido) {
            setBgColor('#CC4B4B');
            setTextColor('white');
        } else if (proximo) {
            setBgColor('#DDE053');
            setTextColor('white');
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
                    <View>
                        <ProductName textColor={textColor}>
                            {product.name}
                        </ProductName>
                        <ProductCode textColor={textColor}>
                            Código: {product.code}
                        </ProductCode>
                        <ProductLote textColor={textColor}>
                            Lote: {product.lotes[0].lote}
                        </ProductLote>
                    </View>

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
