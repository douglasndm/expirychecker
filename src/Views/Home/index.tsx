import React, { useState, useEffect, useCallback } from 'react';

import {
    getAllProductsWithBatches,
    removeAllTreatedBatchesFromAllProducts,
    sortProductsBatchesByBatchExpDate,
    sortProductsByFirstBatchExpDate,
} from '../../Functions/Products';

import Header from '../../Components/Header';
import FABProducts from '../../Components/FABProducts';
import Notification from '../../Components/Notification';
import ListProducts from '../../Components/ListProducts';

import { Container, InputSearch } from './styles';

const Home: React.FC = () => {
    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [error, setError] = useState<string>();

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

    async function getProduts() {
        try {
            const resultsDB = await getAllProductsWithBatches();

            // APARENTEMENTE O REALM SO CONSULTA O PRIMEIRO REGISTRO DE ARRAY PARA FAZER O 'WHERE'
            // ESSA FUNÇÃO REMOVE QUALQUER VESTIGIO DE LOTES TRATADOS
            const semTratados = removeAllTreatedBatchesFromAllProducts(
                resultsDB
            );

            // PRIMEIRO PRECISEI PERCORRER TODOS OS RESULTADOS E ORDERNAR CADA LOTE INDIVIDUALMENTE
            // E COM ISSO RETORNA UM NOVO ARRAY DE OBJETO, PQ NAO ERA POSSIVEL RETORNA O
            // ANTIGO MODIFICADO
            const resultsTemp = sortProductsBatchesByBatchExpDate(semTratados);
            // classifica os produtos em geral pelo o mais proximo de vencer
            // DEPOIS DE TER TODOS OS PRODUTOS COM OS SEUS LOTES ORDENADOS POR VENCIMENTO, SIMPLISMENTE PEGO O
            // PRIMEIRO LOTE DE CADA PRODUTO(JÁ QUE SEMPRE SERÁ O MAIS PROXIMO A VENCER) E FAÇO A ORDENAÇÃO
            // DE TODOS OS PRODUTOS BASEADO NESTE PRIMEIRO LOTE
            const results = sortProductsByFirstBatchExpDate(resultsTemp);

            if (results.length > 10) {
                const resultsMin = [];
                const howManyResultsToShow =
                    results.length > 20 ? 20 : results.length;

                for (let i = 0; i < howManyResultsToShow; i++) {
                    resultsMin.push(results[i]);
                }

                setProducts(resultsMin);
            } else {
                setProducts(results);
            }
        } catch (err) {
            setError(err.message);
        }
    }

    useEffect(() => {
        getProduts();
    }, []);

    useEffect(() => {
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const query = search.trim().toLowerCase();

                const productsFind = products.filter((product) => {
                    const searchByName = product.name
                        .toLowerCase()
                        .includes(query);

                    if (searchByName) {
                        return true;
                    }

                    if (product.code) {
                        const searchBycode = product.code
                            .toLowerCase()
                            .includes(query);

                        if (searchBycode) {
                            return true;
                        }
                    }

                    if (product.store) {
                        const searchByStore = product.store
                            .toLowerCase()
                            .includes(query);

                        if (searchByStore) {
                            return true;
                        }
                    }

                    if (product.batches.length > 0) {
                        const lotesFounded = product.batches.filter((lote) => {
                            const searchByLoteName = lote.name
                                .toLowerCase()
                                .includes(query);

                            if (searchByLoteName) {
                                return true;
                            }

                            return false;
                        });

                        if (lotesFounded.length > 0) {
                            return true;
                        }
                    }

                    return false;
                });

                setProductsSearch(productsFind);
            } else {
                setProductsSearch(products);
            }
        },
        [products]
    );

    return (
        <Container>
            <Header />

            {products.length > 0 && (
                <InputSearch
                    placeholder="Pesquisar por um produto"
                    value={searchString}
                    onChangeText={handleSearchChange}
                />
            )}

            <ListProducts products={productsSearch} isHome />
            {error && (
                <Notification
                    NotificationMessage={error}
                    NotificationType="error"
                />
            )}
            <FABProducts />
        </Container>
    );
};

export default Home;
