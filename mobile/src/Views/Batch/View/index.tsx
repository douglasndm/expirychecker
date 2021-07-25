import React, {
    useCallback,
    useMemo,
    useState,
    useContext,
    useEffect,
} from 'react';
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

import { getProductById } from '~/Functions/Product';

interface Props {
    product_id: number;
    batch: string;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { goBack, navigate, addListener } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const routeParams = params as Props;

    const [product, setProduct] = useState<IProduct | null>(null);

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

    const productId = useMemo(() => {
        return routeParams.product_id;
    }, [routeParams.product_id]);

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
                productId,
                loteId: batch.id,
            });
        }
    }, [batch, navigate, productId]);

    const handleShare = useCallback(async () => {
        if (!product) {
            return;
        }
        try {
            setIsSharing(true);

            let text = '';

            if (!!batch.amount && batch.amount > 0) {
                text = strings.View_ShareProduct_MessageWithAmount.replace(
                    '{PRODUCT}',
                    product.name
                )
                    .replace('{AMOUNT}', String(batch.amount))
                    .replace('{DATE}', exp_date);
            } else {
                text = strings.View_ShareProduct_Message.replace(
                    '{PRODUCT}',
                    product.name
                ).replace('{DATE}', exp_date);
            }

            if (userPreferences.isUserPremium) {
                await ShareProductImageWithText({
                    productId,
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
        product,
        batch.amount,
        userPreferences.isUserPremium,
        exp_date,
        productId,
    ]);

    const loadData = useCallback(async () => {
        try {
            const prod = await getProductById(productId);

            setProduct(prod);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [productId]);

    useEffect(() => {
        const unsubscribe = addListener('focus', () => {
            loadData();
        });

        return unsubscribe;
    }, [addListener, loadData]);

    return (
        <Container>
            <PageHeader>
                <PageTitleContainer>
                    <BackButton handleOnPress={goBack} />
                    <PageTitle>{strings.View_Batch_PageTitle}</PageTitle>
                </PageTitleContainer>

                <ActionsButtonContainer>
                    <ButtonPaper
                        icon={() => <Icons name="create-outline" size={22} />}
                        onPress={handleNaviEdit}
                    >
                        {strings.View_Batch_Button_Edit}
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
                        <BatchAmount>{`${strings.View_Batch_Amount}: ${batch.amount}`}</BatchAmount>
                    )}

                    {!!batch.price && (
                        <BatchPrice>
                            {`${strings.View_Batch_UnitPrice} `}
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

                    {userPreferences.isUserPremium && (
                        <Button
                            text={
                                strings.View_Batch_Button_ShareWithAnotherApps
                            }
                            onPress={handleShare}
                            isLoading={isSharing}
                            contentStyle={{ width: 250 }}
                        />
                    )}
                </BatchContainer>
            )}
        </Container>
    );
};

export default View;
