import React, { useState, useEffect, useCallback } from 'react';

import Loading from '../../Components/Loading';
import Header from '../../Components/Header';
import ListProducts from '../../Components/ListProducts';
import FABProducts from '../../Components/FABProducts';
import BarCodeReader from '../../Components/BarCodeReader';

import {
    getAllProducts,
    searchForAProductInAList,
} from '../../Functions/Products';

import {
    InputSearch,
    InputTextContainer,
    InputTextIconContainer,
    InputTextIcon,
} from '../Home/styles';

import { Container } from './styles';

const AllProducts: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    const getProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                sortProductsByExpDate: true,
            });

            setProducts(allProducts);
        } catch (error) {
            throw new Error(error);
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
        (code) => {
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
                        <Header title="Todos os produtos" />

                        {products.length > 0 && (
                            <InputTextContainer>
                                <InputSearch
                                    placeholder="Pesquisar por um produto"
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

                    <FABProducts />
                </>
            )}
        </>
    );
};

export default AllProducts;
