import React, { useCallback, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import {
    sortProductsByFisrtLoteExpDate,
    sortProductsLotesByLotesExpDate,
} from '~/Functions/Products';

import { getAllBrands, getAllProductsByBrand } from '~/Utils/Brands';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';
import ListProducts from '~/Components/ListProducts';

import {
    FloatButton,
    Icons as FloatIcon,
} from '~/Components/ListProducts/styles';

import {
    Container,
    ItemTitle,
    ActionsButtonContainer,
    ActionButton,
    Icons,
} from '~/Styles/Views/GenericViewPage';

interface Props {
    brand_id: string;
}

const View: React.FC = () => {
    const { params } = useRoute();
    const { navigate } = useNavigation();

    const routeParams = params as Props;

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [categoryName, setCategoryName] = useState<string>('CategoryTitle');

    const [products, setProducts] = useState<IProduct[]>([]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const brands = await getAllBrands();
            const findCat = brands.find(c => c.id === routeParams.brand_id);

            if (findCat) {
                setCategoryName(findCat.name);
            }

            const prods = await getAllProductsByBrand(routeParams.brand_id);

            // ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
            const sortedProds = sortProductsLotesByLotesExpDate(prods);

            // DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
            // CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
            // DE QUAL ESTÁ MAIS PRÓXIMO
            const results = sortProductsByFisrtLoteExpDate(sortedProds);

            setProducts(results);
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [routeParams.brand_id]);

    const handleEdit = useCallback(() => {
        navigate('BrandEdit', { brand_id: routeParams.brand_id });
    }, [navigate, routeParams.brand_id]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct', { brand: routeParams.brand_id });
    }, [navigate, routeParams.brand_id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={strings.View_Brand_View_PageTitle} noDrawer />

            <ItemTitle>{categoryName}</ItemTitle>

            <ActionsButtonContainer>
                <ActionButton
                    icon={() => <Icons name="create-outline" size={22} />}
                    onPress={handleEdit}
                >
                    {strings.View_ProductDetails_Button_UpdateProduct}
                </ActionButton>
            </ActionsButtonContainer>

            <ListProducts products={products} deactiveFloatButton />

            <FloatButton
                icon={() => (
                    <FloatIcon name="add-outline" color="white" size={22} />
                )}
                small
                label={strings.View_FloatMenu_AddProduct}
                onPress={handleNavigateAddProduct}
            />
        </Container>
    );
};

export default View;
