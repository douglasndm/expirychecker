import React, { useCallback, useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';

import { translate } from '~/Locales';

import {
    getAllCategories,
    getAllProductsByCategory,
} from '~/Functions/Category';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import Notification from '~/Components/Notification';

import { Container, CategoryTitle } from './styles';

interface Props {
    id: string;
}

const CategoryView: React.FC = () => {
    const { params } = useRoute();

    const routeParams = params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [categoryName, setCategoryName] = useState<string>('CategoryTitle');

    const [products, setProducts] = useState<IProduct[]>([]);

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const categories = await getAllCategories();
            const findCat = categories.find((c) => c.id === routeParams.id);

            if (findCat) {
                setCategoryName(findCat.name);
            }

            const prods = await getAllProductsByCategory(routeParams.id);

            setProducts(prods);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header />

            <CategoryTitle>
                {translate('View_Category_List_View_BeforeCategoryName')}
                {categoryName}
            </CategoryTitle>

            <ListProducts products={products} />

            {!!error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                    onPress={handleDimissNotification}
                />
            )}
        </Container>
    );
};

export default CategoryView;