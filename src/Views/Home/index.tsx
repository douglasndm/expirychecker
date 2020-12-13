import React, { useState, useEffect, useCallback } from 'react';

import {
    removeAllLotesTratadosFromAllProduts,
    searchForAProductInAList,
    GetAllProducts,
    getAllProducts,
} from '../../Functions/Products';

import Loading from '../../Components/Loading';
import Header from '../../Components/Header';
import FABProducts from '../../Components/FABProducts';
import Notification from '../../Components/Notification';
import ListProducts from '../../Components/ListProducts';
import BarCodeReader from '../../Components/BarCodeReader';

import {
    Container,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';

const Home: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [error, setError] = useState<string>();

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    async function getProduts() {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                limit: 20,
                removeProductsWithoutBatches: true,
                sortProductsByExpDate: true,
            });

            // APARENTEMENTE O REALM SO CONSULTA O PRIMEIRO REGISTRO DE ARRAY PARA FAZER O 'WHERE'
            // ESSA FUNÇÃO REMOVE QUALQUER VESTIGIO DE LOTES TRATADOS
            const results = removeAllLotesTratadosFromAllProduts(allProducts);

            setProducts(results);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getProduts();
    }, []);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const allProducts = await GetAllProducts();

                const findProducts = searchForAProductInAList({
                    products: allProducts,
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

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleOnCodeRead = useCallback(
        (code) => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    const handleDimissNotification = useCallback(() => {
        setError('');
    }, []);

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
                <Container>
                    <Header />

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

                    <ListProducts products={productsSearch} isHome />

                    {!!error && (
                        <Notification
                            NotificationMessage={error}
                            NotificationType="error"
                            onPress={handleDimissNotification}
                        />
                    )}
                    <FABProducts />
                </Container>
            )}
        </>
    );
};

export default Home;
