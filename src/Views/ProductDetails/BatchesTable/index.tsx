import React, { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { format, isPast, addDays } from 'date-fns'; //eslint-disable-line
import br from 'date-fns/locale/pt-BR'; //eslint-disable-line
import NumberFormat from 'react-number-format';

import PreferencesContext from '../../../Contexts/PreferencesContext';

import {
    CategoryDetails,
    CategoryDetailsText,
    TableContainer,
    Table,
    TableHeader,
    TableTitle,
    TableRow,
    TableCell,
    Text,
} from './styles';

interface Props {
    productId: number;
    title: string;
    batches: Array<IBatch>;
}

const BatchesTable: React.FC<Props> = ({
    productId,
    title,
    batches,
}: Props) => {
    const { navigate } = useNavigation();
    const { userPreferences } = useContext(PreferencesContext);

    return (
        <TableContainer>
            <CategoryDetails>
                <CategoryDetailsText>{title}</CategoryDetailsText>
            </CategoryDetails>

            <Table>
                <TableHeader>
                    <TableTitle>LOTE</TableTitle>
                    <TableTitle>VENCIMENTO</TableTitle>
                    <TableTitle>QUANTIDADE</TableTitle>
                    <TableTitle>PREÇO</TableTitle>
                </TableHeader>

                {batches.map((batch) => {
                    const expired = isPast(new Date(batch.exp_date));
                    const nextToExp =
                        addDays(
                            new Date(),
                            userPreferences.howManyDaysToBeNextToExpire
                        ) > new Date(batch.exp_date);

                    const expiredOrNext = !!(expired || nextToExp);

                    return (
                        <TableRow
                            key={batch.id}
                            expired={expired}
                            nextToExp={nextToExp}
                            onPress={() => {
                                navigate('EditLote', {
                                    productId,
                                    loteId: batch.id,
                                });
                            }}
                        >
                            <TableCell>
                                <Text expiredOrNext={expiredOrNext}>
                                    {batch.name}
                                </Text>
                            </TableCell>
                            <TableCell>
                                <Text expiredOrNext={expiredOrNext}>
                                    {format(
                                        new Date(batch.exp_date),
                                        'dd/MM/yyyy',
                                        {
                                            locale: br,
                                        }
                                    )}
                                </Text>
                            </TableCell>
                            <TableCell>
                                <Text expiredOrNext={expiredOrNext}>
                                    {batch.amount}
                                </Text>
                            </TableCell>
                            {!!batch.amount &&
                                !!batch.price &&
                                batch.price > 0 && (
                                    <TableCell>
                                        <Text expiredOrNext={expiredOrNext}>
                                            <NumberFormat
                                                value={
                                                    batch.amount * batch.price
                                                }
                                                displayType="text"
                                                thousandSeparator
                                                prefix="R$"
                                                renderText={(value) => value}
                                                decimalScale={2}
                                            />
                                        </Text>
                                    </TableCell>
                                )}
                        </TableRow>
                    );
                })}
            </Table>
        </TableContainer>
    );
};

export default BatchesTable;
