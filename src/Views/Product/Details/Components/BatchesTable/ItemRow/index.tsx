import React, { memo, useMemo, useContext, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { isPast, addDays, format } from 'date-fns';//eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { RowContainer, TableRow, TableCell, Text } from './styles';

interface Props {
    productId: number;
    batch: ILote;
    onLongPress: () => void;
}

const ItemRow: React.FC<Props> = ({ batch, productId, onLongPress }: Props) => {
    const { navigate } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const languageCode = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return enUS;
        }
        return ptBR;
    }, []);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const currencyPrefix = useMemo(() => {
        if (getLocales()[0].countryCode === 'BR') {
            return 'R$';
        }
        if (getLocales()[0].countryCode === 'PT') {
            return '€';
        }
        return '$';
    }, []);

    const expired = useMemo(() => isPast(batch.exp_date), [batch.exp_date]);
    const nextToExp = useMemo(() => {
        return (
            addDays(new Date(), userPreferences.howManyDaysToBeNextToExpire) >
            batch.exp_date
        );
    }, [batch.exp_date, userPreferences.howManyDaysToBeNextToExpire]);

    const treated = useMemo(
        () => batch.status?.toLowerCase() === 'tratado',
        [batch.status]
    );

    const price = useMemo(() => {
        if (batch.amount && batch.price) {
            return (
                batch.amount *
                parseFloat(String(batch.price).replace(/\$/g, ''))
            );
        }

        return 0;
    }, [batch.amount, batch.price]);

    const handleNavigateEditBatch = useCallback(() => {
        navigate('EditLote', {
            productId,
            loteId: batch.id,
        });
    }, [batch.id, navigate, productId]);

    return (
        <RowContainer
            onLongPress={onLongPress}
            onPress={handleNavigateEditBatch}
        >
            <TableRow
                key={batch.id}
                expired={expired}
                nextToExp={nextToExp}
                treated={treated}
            >
                <TableCell>
                    <Text
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                    >
                        {!!batch.lote ? batch.lote : batch.id}
                    </Text>
                </TableCell>
                <TableCell>
                    <Text
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                    >
                        {format(batch.exp_date, dateFormat, {
                            locale: languageCode,
                        })}
                    </Text>
                </TableCell>
                <TableCell style={{ justifyContent: 'center' }}>
                    <Text
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                    >
                        {batch.amount}
                    </Text>
                </TableCell>

                <TableCell>
                    <Text
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                    >
                        <NumberFormat
                            value={price}
                            displayType="text"
                            thousandSeparator
                            prefix={currencyPrefix}
                            renderText={value => value}
                            decimalScale={2}
                        />
                    </Text>
                </TableCell>
            </TableRow>
        </RowContainer>
    );
};

export default memo(ItemRow);
