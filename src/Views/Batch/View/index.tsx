import React, { useCallback, useMemo, useState, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';//eslint-disable-line
import { ptBR, pt, enUS } from 'date-fns/locale' // eslint-disable-line
import NumberFormat from 'react-number-format';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { ShareProductImageWithText, shareText } from '~/Functions/Share';

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

    const { userPreferences } = useContext(PreferencesContext);

    const routeParams = params as Props;

    const [isSharing, setIsSharing] = useState<boolean>(false);

    const languageCode = useMemo(() => {
        if (getLocales()[0].languageCode === 'BR') {
            return ptBR;
        }
        if (getLocales()[0].languageCode === 'pt') {
            return pt;
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

    const date = useMemo(() => {
        return parseISO(String(batch.exp_date));
    }, [batch.exp_date]);

    const expired = useMemo(() => {
        return isPast(date);
    }, [date]);

    const exp_date = useMemo(() => {
        return format(date, dateFormat, {
            locale: languageCode,
        });
    }, [date, dateFormat, languageCode]);

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

            if (userPreferences.isUserPremium) {
                await ShareProductImageWithText({
                    productId: prod.id,
                    title: strings.View_ShareProduct_Title,
                    text,
                });
            } else {
                await shareText({
                    title: strings.View_ShareProduct_Title,
                    text,
                });
            }
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
    }, [
        batch.amount,
        userPreferences.isUserPremium,
        prod.name,
        prod.id,
        exp_date,
    ]);

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

                    <BatchExpDate>
                        {expired
                            ? strings.ProductCardComponent_ProductExpiredIn
                            : strings.ProductCardComponent_ProductExpireIn}

                        {` ${formatDistanceToNow(date, {
                            addSuffix: true,
                            locale: languageCode,
                        })}`}

                        {`${format(
                            parseISO(String(batch.exp_date)),
                            `, EEEE, ${dateFormat}`,
                            {
                                locale: languageCode,
                            }
                        )}`}
                    </BatchExpDate>

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
