import React, { useState, useEffect, useCallback, useContext } from 'react';

import Header from '../../Components/Header';
import ListProducts from '../../Components/ListProducts';
import FABProducts from '../../Components/FABProducts';

import RealmContext from '../../Contexts/RealmContext';

import {
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
    GetAllProducts,
} from '../../Functions/Products';

import { InputSearch } from '../Home/styles';

import { Container } from './styles';

const AllProducts: React.FC = () => {
    const { Realm } = useContext(RealmContext);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

    const getProducts = useCallback(async () => {
        try {
            const allProducts: Array<IProduct> = await GetAllProducts();

            // APARENTEMENTE O REALM SO CONSULTA O PRIMEIRO REGISTRO DE ARRAY PARA FAZER O 'WHERE'
            // ESSA FUNÇÃO REMOVE QUALQUER VESTIGIO DE LOTES TRATADOS
            // const semTratados = removeAllLotesTratadosFromAllProduts(allProducts);

            // PRIMEIRO PRECISEI PERCORRER TODOS OS RESULTADOS E ORDERNAR CADA LOTE INDIVIDUALMENTE
            // E COM ISSO RETORNA UM NOVO ARRAY DE OBJETO, PQ NAO ERA POSSIVEL RETORNA O
            // ANTIGO MODIFICADO
            const resultsTemp = sortProductsLotesByLotesExpDate(allProducts);
            // classifica os produtos em geral pelo o mais proximo de vencer
            // DEPOIS DE TER TODOS OS PRODUTOS COM OS SEUS LOTES ORDENADOS POR VENCIMENTO, SIMPLISMENTE PEGO O
            // PRIMEIRO LOTE DE CADA PRODUTO(JÁ QUE SEMPRE SERÁ O MAIS PROXIMO A VENCER) E FAÇO A ORDENAÇÃO
            // DE TODOS OS PRODUTOS BASEADO NESTE PRIMEIRO LOTE
            const results = sortProductsByFisrtLoteExpDate(resultsTemp);

            setProducts(results);
        } catch (error) {
            throw new Error(error);
        }
    }, []);

    useEffect(() => {
        async function startRealm() {
            Realm.addListener('change', () => getProducts());

            getProducts();
        }

        startRealm();

        return () => {
            Realm.removeAllListeners();
        };
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

                    if (product.lotes.length > 0) {
                        const lotesFounded = product.lotes.filter((lote) => {
                            const searchByLoteName = lote.lote
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
        <>
            <Container>
                <Header title="Todos os produtos" />

                {products.length > 0 && (
                    <InputSearch
                        placeholder="Pesquisar por um produto"
                        value={searchString}
                        onChangeText={handleSearchChange}
                    />
                )}

                <ListProducts products={productsSearch} />
            </Container>

            <FABProducts />
        </>
    );
};

export default AllProducts;
