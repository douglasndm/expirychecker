import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import {  format, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, pt, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

import strings from '~/Locales';

import { ShareProductImageWithText } from '~/Functions/Share';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';

import { PageTitle } from '~/Views/Product/Add/styles';

import {
    ActionsButtonContainer,
    ButtonPaper,
} from '~/Views/Product/Edit/styles';

import { PageHeader, PageTitleContainer, Icons } from '../Edit/styles';

import {
    Container,
    BatchContainer,
    BatchTitle,
    BatchExpDate,
    BatchAmount,
    BatchPrice,
} from './styles';

interface Props {
    product: string;
    batch: string;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { goBack, navigate } = useNavigation();

    const routeParams = params as Props;

    const [isSharing, setIsSharing] = useState<boolean>(false);

    const languageCode = useMemo(() => {
        if (getLocales()[0].languageCode === 'BR') {
            return ptBR;
        }
        return enUS;
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

    const prod = useMemo(() => {
        return JSON.parse(routeParams.product) as IProduct;
    }, [routeParams.product]);

    const batch = useMemo(() => {
        return JSON.parse(routeParams.batch) as ILote;
    }, [routeParams.batch]);

    const exp_date = useMemo(() => {
        return format(parseISO(String(batch.exp_date)), dateFormat, {
            locale: languageCode,
        });
    }, [batch.exp_date, dateFormat, languageCode]);

    const handleNaviEdit = useCallback(() => {
        if (batch) {
            navigate('EditLote', {
                productId: prod.id,
                loteId: batch.id,
            });
        }
    }, [batch, navigate, prod.id]);

    const handleShare = useCallback(async () => {
        try {
            setIsSharing(true);

            let text = '';

            if (!!batch.amount && batch.amount > 0) {
                text = strings.View_ShareProduct_MessageWithAmount.replace(
                    '{PRODUCT}',
                    prod.name
                )
                    .replace('{AMOUNT}', String(batch.amount))
                    .replace('{DATE}', exp_date);
            } else {
                text = strings.View_ShareProduct_Message.replace(
                    '{PRODUCT}',
                    prod.name
                ).replace('{DATE}', exp_date);
            }

            await ShareProductImageWithText({
                productId: prod.id,
                title: strings.View_ShareProduct_Title,
                text,
            });
        } catch (err) {
            if (err.message !== 'User did not share') {
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
            }
        } finally {
            setIsSharing(false);
        }
    }, [batch.amount, prod.id, prod.name, exp_date]);

    return (
        <Container>
            <PageHeader>
                <PageTitleContainer>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>Lote</PageTitle>
                </PageTitleContainer>

                <ActionsButtonContainer>
                    <ButtonPaper
                        icon={() => <Icons name="create-outline" size={22} />}
                        onPress={handleNaviEdit}
                    >
                        Editar
                    </ButtonPaper>
                </ActionsButtonContainer>
            </PageHeader>

            {!!batch && (
                <BatchContainer>
                    <BatchTitle>{batch.lote}</BatchTitle>

                    <BatchExpDate>{`Vence em ${exp_date}`}</BatchExpDate>

                    {!!batch.amount && (
                        <BatchAmount>Quantidade {batch.amount}</BatchAmount>
                    )}

                    {!!batch.price && (
                        <BatchPrice>
                            {`Preço unitário `}
                            <NumberFormat
                                value={batch.price}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    <Button
                        text="Compartilhar com outros apps"
                        onPress={handleShare}
                        isLoading={isSharing}
                        contentStyle={{ width: 250 }}
                    />
                </BatchContainer>
            )}
        </Container>
    );
};

export default View;
