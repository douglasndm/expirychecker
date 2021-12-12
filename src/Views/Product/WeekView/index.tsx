import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import {
    addDays,
    compareAsc,
    eachWeekOfInterval,
    format,
    isPast,
} from 'date-fns';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import Accordion from 'react-native-collapsible/Accordion';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ProductCard from '~/Components/ListProducts/ProductCard';
import FloatButton from '~/Components/FloatButton';

import { getAllProducts } from '~/Functions/Products';

import {
    Container,
    PageContent,
    ProductCount,
    WeekContainer,
    WeekText,
} from './styles';

const WeekView: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [weeks, setWeeks] = useState<WeekProps[]>([]);
    const [activeSection, setActiveSection] = useState<number[]>([]);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const allProducts = await getAllProducts({
                sortProductsByExpDate: true,
                removeTreatedBatch: true,
            });

            const batches: ILote[] = [];

            allProducts.forEach(p => p.lotes.forEach(b => batches.push(b)));

            const sorted = batches.sort((b1, b2) =>
                compareAsc(b1.exp_date, b2.exp_date)
            );

            const weeksInUse = eachWeekOfInterval({
                start: sorted[0].exp_date,
                end: sorted[sorted.length - 1].exp_date,
            });

            const weeksProds = weeksInUse.map(week => {
                const prods: IProduct[] = [];

                const weekLimit = addDays(week, 7);

                allProducts.forEach(prod => {
                    const filtedBatches = prod.lotes.filter(b => {
                        const { exp_date } = b;

                        if (compareAsc(weekLimit, exp_date) >= 0) {
                            if (compareAsc(exp_date, week) >= 0) {
                                if (b.status?.toLowerCase() !== 'tratado') {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });

                    if (filtedBatches.length > 0) {
                        prods.push({
                            ...prod,
                            lotes: filtedBatches,
                        });
                    }
                });

                const weekProps: WeekProps = {
                    date: week,
                    products: prods,
                };
                return weekProps;
            });

            const usedWeeks = weeksProds.filter(wp => wp.products.length > 0);

            setWeeks(usedWeeks);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const renderSectionTitle = useCallback(
        (week: WeekProps, index: number) => {
            const onPress = () => {
                if (activeSection[0] === index) {
                    setActiveSection([]);
                    return;
                }
                setActiveSection([index]);
            };

            const dateFormatted = format(week.date, dateFormat);
            const isExpired = isPast(week.date);
            const isNext =
                addDays(
                    new Date(),
                    userPreferences.howManyDaysToBeNextToExpire
                ) >= week.date;

            return (
                <WeekContainer
                    onPress={onPress}
                    isPast={isExpired}
                    isNext={isNext}
                >
                    <WeekText isPast={isExpired} isNext={isNext}>
                        {`${strings.View_ProductsByWeeks_WeekTitle} ${dateFormatted}`}
                    </WeekText>
                    <ProductCount isPast={isExpired} isNext={isNext}>
                        {`${strings.View_ProductsByWeeks_ProductsCount.replace(
                            '{COUNT}',
                            week.products.length
                        )}`}
                    </ProductCount>
                </WeekContainer>
            );
        },
        [activeSection, dateFormat, userPreferences.howManyDaysToBeNextToExpire]
    );

    const renderContent = useCallback((week: WeekProps) => {
        return week.products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
        ));
    }, []);

    const sections = useMemo(() => {
        return weeks.map(week => {
            return {
                date: week.date,
                products: week.products,
            };
        });
    }, [weeks]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={strings.View_ProductsByWeeks_Title} />

            <PageContent>
                <Accordion
                    sections={sections}
                    activeSections={activeSection}
                    renderHeader={() => <></>}
                    renderSectionTitle={renderSectionTitle}
                    renderContent={renderContent}
                />
            </PageContent>

            <FloatButton navigateTo="AddProduct" />
        </Container>
    );
};

export default WeekView;
