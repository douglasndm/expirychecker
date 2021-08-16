import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import { getLocales } from 'react-native-localize';
import NumberFormat from 'react-number-format';

import strings from '~/Locales';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

import {
    Container,
    Content,
    BatchName,
    BatchPrice,
    SliderContent,
    TempPrice,
    Slider,
    NewPrice,
} from './styles';
import { getLoteById } from '~/Functions/Lotes';
import { updateBatch } from '~/Functions/Products/Batches/Batch';

interface Params {
    batch_id: number;
}

const Discount: React.FC = () => {
    const route = useRoute();
    const { pop, addListener } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const routeParams = route.params as Params;

    const [batch, setBatch] = useState<ILote | null>(null);

    const [applyingDiscount, setApplyingDiscount] = useState<boolean>(false);
    const [discount, setDiscount] = useState<number>(0);
    const [newPrice, setNewPrice] = useState<number>(0);

    const currencyPrefix = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return '$';
        }

        return 'R$';
    }, []);

    const handleApplyDiscount = useCallback(async () => {
        if (!batch) {
            return;
        }

        try {
            setApplyingDiscount(true);

            await updateBatch({
                ...batch,
                id: routeParams.batch_id,
                price_tmp: newPrice,
            });

            showMessage({
                message: strings.View_Batch_Discount_Alert_Success,
                type: 'info',
            });

            pop();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setApplyingDiscount(false);
        }
    }, [batch, newPrice, pop, routeParams.batch_id]);

    const onSliderChange = useCallback(
        (value: number) => {
            setDiscount(value);

            if (batch && batch.price) {
                const priceAsString = String(batch.price);
                const fullPrice = Number(
                    priceAsString.replace(/[^0-9.-]+/g, '')
                );

                const currentDiscount = fullPrice * value;
                setNewPrice(fullPrice - currentDiscount);
            }
        },
        [batch]
    );

    useEffect(() => {
        const unsubscribe = addListener('focus', () => {
            getLoteById(routeParams.batch_id).then(response => {
                if (response) setBatch(response);
                return null;
            });
        });

        return unsubscribe;
    }, [addListener, routeParams.batch_id]);

    return (
        <Container>
            <Header title={strings.View_Batch_Discount_PageTitle} noDrawer />

            {!!batch && (
                <Content>
                    <BatchName>{`${strings.View_Batch_Discount_Batch_Name} ${batch.lote}`}</BatchName>
                    <BatchPrice>
                        {`${strings.View_Batch_Discount_Batch_Price} `}
                        <NumberFormat
                            value={batch.price}
                            displayType="text"
                            thousandSeparator
                            prefix={currencyPrefix}
                            renderText={value => value}
                            decimalScale={2}
                        />
                    </BatchPrice>

                    <SliderContent>
                        <TempPrice>
                            {strings.View_Batch_Discount_Batch_DiscountPercentage.replace(
                                '{PERCENTAGE}',
                                Math.round(discount * 100).toString()
                            )}
                        </TempPrice>

                        <Slider
                            minimumValue={0}
                            maximumValue={1}
                            onValueChange={onSliderChange}
                        />

                        <NewPrice>
                            {`${strings.View_Batch_Discount_Batch_DiscountedPrice} `}
                            <NumberFormat
                                value={newPrice}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </NewPrice>
                    </SliderContent>

                    <Button
                        text={strings.View_Batch_Discount_Button_Apply}
                        onPress={handleApplyDiscount}
                        isLoading={applyingDiscount}
                    />
                </Content>
            )}
        </Container>
    );
};

export default Discount;
