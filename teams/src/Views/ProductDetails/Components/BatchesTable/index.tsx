import React, { useContext, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { isPast, addDays, format, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
    Text,
} from './styles';

interface BatchesTableProps {
    productId: string;
    batches: Array<IBatch>;
}

const BatchesTable: React.FC<BatchesTableProps> = ({
    productId,
    batches,
}: BatchesTableProps) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { navigate } = useNavigation();

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
        if (getLocales()[0].languageCode === 'en') {
            return '$';
        }

        return 'R$';
    }, []);

    return (
        <Table>
            <TableHeader>
                <TableTitle>
                    {translate(
                        'View_ProductDetails_TableComponent_BatchNameColumnTitle'
                    )}
                </TableTitle>
                <TableTitle>
                    {translate(
                        'View_ProductDetails_TableComponent_BatchExpInColumnTitle'
                    )}
                </TableTitle>
                <TableTitle>
                    {translate(
                        'View_ProductDetails_TableComponent_BatchAmountColumnTitle'
                    )}
                </TableTitle>
                <TableTitle>
                    {translate(
                        'View_ProductDetails_TableComponent_BatchPriceColumnTitle'
                    )}
                </TableTitle>
            </TableHeader>

            {batches.map(batch => {
                const exp_date = parseISO(batch.exp_date);

                const expired = isPast(exp_date);
                const nextToExp =
                    addDays(
                        new Date(),
                        userPreferences.howManyDaysToBeNextToExpire
                    ) > exp_date;

                const treated = batch.status === 'checked';

                return (
                    <TableRow
                        key={batch.id}
                        expired={expired}
                        nextToExp={nextToExp}
                        treated={treated}
                        onPress={() => {
                            navigate('EditLote', {
                                productId,
                                batchId: batch.id,
                            });
                        }}
                    >
                        <TableCell>
                            <Text
                                expired={expired}
                                nextToExp={nextToExp}
                                treated={treated}
                            >
                                {batch.name}
                            </Text>
                        </TableCell>
                        <TableCell>
                            <Text
                                expired={expired}
                                nextToExp={nextToExp}
                                treated={treated}
                            >
                                {format(exp_date, dateFormat, {
                                    locale: languageCode,
                                })}
                            </Text>
                        </TableCell>
                        <TableCell>
                            <Text
                                expired={expired}
                                nextToExp={nextToExp}
                                treated={treated}
                            >
                                {batch.amount}
                            </Text>
                        </TableCell>
                        {!!batch.amount && !!batch.price && batch.price > 0 && (
                            <TableCell>
                                <Text
                                    expired={expired}
                                    nextToExp={nextToExp}
                                    treated={treated}
                                >
                                    <NumberFormat
                                        value={batch.amount * batch.price}
                                        displayType="text"
                                        thousandSeparator
                                        prefix={currencyPrefix}
                                        renderText={value => value}
                                        decimalScale={2}
                                    />
                                </Text>
                            </TableCell>
                        )}
                    </TableRow>
                );
            })}
        </Table>
    );
};

export default BatchesTable;
