import React, { useState, useEffect, useCallback, useContext } from 'react';

import ListProducts from '../../Components/ListProducts';
import FABProducts from '../../Components/FABProducts';

import RealmContext from '../../Contexts/RealmContext';

import {
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
    GetAllProducts,
} from '../../Functions/Products';

import { Container } from './styles';

const AllProducts: React.FC = () => {
    const { Realm } = useContext(RealmContext);

    const [products, setProducts] = useState<Array<IProduct>>([]);

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

    return (
        <>
            <Container>
                <ListProducts products={products} />
            </Container>

            <FABProducts />
        </>
    );
};

export default AllProducts;
