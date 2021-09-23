import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { addDays, compareAsc, eachWeekOfInterval, format } from 'date-fns';
import { showMessage } from 'react-native-flash-message';
import Accordion from 'react-native-collapsible/Accordion';

import strings from '~/Locales';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ProductCard from '~/Components/ListProducts/ProductCard';

import { getAllProducts } from '~/Functions/Products';

import {
    Container,
    PageContent,
    ProductCount,
    WeekContainer,
    WeekText,
} from './styles';

const WeekView: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [weeks, setWeeks] = useState<WeekProps[]>([]);
    const [activeSection, setActiveSection] = useState([0]);

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

    const renderSectionTitle = useCallback((week: WeekProps, index: number) => {
        const onPress = () => {
            setActiveSection([index]);
        };

        return (
            <WeekContainer onPress={onPress}>
                <WeekText>A partir de {week.date}</WeekText>
                <ProductCount>{week.products.length} Produtos</ProductCount>
            </WeekContainer>
        );
    }, []);

    const renderContent = useCallback((week: WeekProps) => {
        return week.products.map(prod => (
            <ProductCard key={prod.id} product={prod} />
        ));
    }, []);

    const sections = useMemo(() => {
        return weeks.map(week => {
            const dateFormatted = format(week.date, 'dd/MM/yyyy');

            return {
                date: dateFormatted,
                products: week.products,
            };
        });
    }, [weeks]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title="Por semanas" />

            <PageContent>
                <Accordion
                    sections={sections}
                    activeSections={activeSection}
                    renderHeader={() => <></>}
                    renderSectionTitle={renderSectionTitle}
                    renderContent={renderContent}
                />
            </PageContent>
        </Container>
    );
};

export default WeekView;
