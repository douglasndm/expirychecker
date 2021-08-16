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

import { ShareProductImageWithText } from '~/Functions/Share';

import BackButton from '~/Components/BackButton';
import Button from '~/Components/Button';
import Loading from '~/Components/Loading';

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
    batch_id: number;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { goBack, navigate, addListener } = useNavigation();

    const routeParams = params as Props;

    const { userPreferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [product, setProduct] = useState<IProduct | null>(null);
    const [batch, setBatch] = useState<ILote | null>(null);

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

    const date = useMemo(() => {
        if (batch) {
            return batch.exp_date;
        }
        return new Date();
    }, [batch]);

    const expired = useMemo(() => {
        return isPast(date);
    }, [date]);

    const exp_date = useMemo(() => {
        return format(date, dateFormat, {
            locale: languageCode,
        });
    }, [date, dateFormat, languageCode]);

    const handleNaviEdit = useCallback(() => {
        navigate('EditLote', {
            productId,
            loteId: routeParams.batch_id,
        });
    }, [navigate, productId, routeParams.batch_id]);

    const handleShare = useCallback(async () => {
        if (!product || !batch) {
            return;
        }
        try {
            setIsSharing(true);

            let text = strings.View_ShareProduct_Message;

            if (!!batch.amount && batch.amount > 0) {
                if (!!batch.price_tmp) {
                    text =
                        strings.View_ShareProduct_MessageWithDiscountAndAmount;

                    text = text.replace(
                        '{TMP_PRICE}',
                        `${currencyPrefix}${batch.price_tmp.toFixed(2)}`
                    );
                    text = text.replace(
                        '{TOTAL_DISCOUNT_PRICE}',
                        `${currencyPrefix}${(
                            batch.price_tmp * batch.amount
                        ).toFixed(2)}`
                    );
                } else {
                    text = strings.View_ShareProduct_MessageWithAmount;
                }
                text = text.replace('{AMOUNT}', String(batch.amount));
            } else if (!!batch.price) {
                text = strings.View_ShareProduct_MessageWithPrice;

                if (!!batch.price_tmp) {
                    text = strings.View_ShareProduct_MessageWithDiscount;
                    text = text.replace(
                        '{TMP_PRICE}',
                        batch.price_tmp.toString()
                    );
                }

                text = text.replace(
                    '{PRICE}',
                    `${currencyPrefix}${batch.price.toFixed(2)}`
                );
            }

            text = text.replace('{PRODUCT}', product.name);
            text = text.replace('{DATE}', exp_date);

            await ShareProductImageWithText({
                productId,
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
    }, [product, batch, exp_date, productId, currencyPrefix]);

    const handleNavigateToDiscount = useCallback(() => {
        navigate('BatchDiscount', {
            batch_id: routeParams.batch_id,
        });
    }, [navigate, routeParams.batch_id]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const prod = await getProductById(productId);

            const b = prod.lotes.find(l => l.id === routeParams.batch_id);

            setProduct(prod);
            if (b) setBatch(b);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [productId, routeParams.batch_id]);

    useEffect(() => {
        const unsubscribe = addListener('focus', () => {
            loadData();
        });

        return unsubscribe;
    }, [addListener, loadData]);

    return isLoading ? (
        <Loading />
    ) : (
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

                        {`${format(date, `, EEEE, ${dateFormat}`, {
                            locale: languageCode,
                        })}`}
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

                    {!!batch.price_tmp && (
                        <BatchPrice>
                            {`Preço temporário `}
                            <NumberFormat
                                value={batch.price_tmp}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    {!!batch.price && !!batch.amount && (
                        <BatchPrice>
                            {`Preço total do lote sem desconto `}
                            <NumberFormat
                                value={batch.price * batch.amount}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    {!!batch.price_tmp && !!batch.amount && (
                        <BatchPrice>
                            {`Preço total do lote com desconto `}
                            <NumberFormat
                                value={batch.price_tmp * batch.amount}
                                displayType="text"
                                thousandSeparator
                                prefix={currencyPrefix}
                                renderText={value => value}
                                decimalScale={2}
                            />
                        </BatchPrice>
                    )}

                    {userPreferences.isUserPremium && (
                        <>
                            <Button
                                text={
                                    strings.View_Batch_Button_ShareWithAnotherApps
                                }
                                onPress={handleShare}
                                isLoading={isSharing}
                                contentStyle={{ width: 250 }}
                            />

                            {!!batch.price && (
                                <Button
                                    text={
                                        strings.View_Batch_Discount_Button_Apply
                                    }
                                    onPress={handleNavigateToDiscount}
                                    contentStyle={{ marginTop: -5, width: 250 }}
                                />
                            )}
                        </>
                    )}
                </BatchContainer>
            )}
        </Container>
    );
};

export default View;
