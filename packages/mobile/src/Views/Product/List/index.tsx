import React, { useState, useEffect, useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import Loading from '~/Components/Loading';
import Header from '@expirychecker/shared/src/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import { getAllProducts, searchForAProductInAList } from '~/Functions/Products';

import {
    InputSearch,
    InputTextContainer,
    InputTextIconContainer,
    InputTextIcon,
} from '~/Views/Home/styles';

import { Container } from './styles';

const List: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] =
        useState<boolean>(false);

    const getProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                sortProductsByExpDate: true,
                removeTreatedBatch: true,
            });
            setProducts(allProducts);
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
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const findProducts = searchForAProductInAList({
                    products,
                    searchFor: search,
                    sortByExpDate: true,
                });

                setProductsSearch(findProducts);
            } else {
                setProductsSearch(products);
            }
        },
        [products]
    );

    const handleOnCodeRead = useCallback(
        code => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {enableBarCodeReader ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={handleOnBarCodeReaderClose}
                />
            ) : (
                <>
                    <Container>
                        <Header title={strings.View_AllProducts_PageTitle} />

                        {products.length > 0 && (
                            <InputTextContainer>
                                <InputSearch
                                    placeholder={
                                        strings.View_AllProducts_SearchPlaceholder
                                    }
                                    value={searchString}
                                    onChangeText={handleSearchChange}
                                />
                                <InputTextIconContainer
                                    onPress={handleOnBarCodeReaderOpen}
                                >
                                    <InputTextIcon name="barcode-outline" />
                                </InputTextIconContainer>
                            </InputTextContainer>
                        )}

                        <ListProducts products={productsSearch} />
                    </Container>
                </>
            )}
        </>
    );
};

export default List;
