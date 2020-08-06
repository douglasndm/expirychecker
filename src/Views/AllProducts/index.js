import React, { useState, useEffect } from 'react';

import Realm from '../../Services/Realm';

import ListProducts from '../../Components/ListProducts';
import FABProducts from '../../Components/FABProducts';

import {
    removeAllLotesTratadosFromAllProduts,
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';

import { Container } from './styles';

const AllProducts = () => {
    const [products, setProducts] = useState([]);

    async function getProduts(realm) {
        try {
            const resultsDB = realm
                .objects('Product')
                .filtered("lotes.@count > 0 AND lotes.status != 'Tratado'")
                .slice();

            // APARENTEMENTE O REALM SO CONSULTA O PRIMEIRO REGISTRO DE ARRAY PARA FAZER O 'WHERE'
            // ESSA FUNÇÃO REMOVE QUALQUER VESTIGIO DE LOTES TRATADOS
            const semTratados = removeAllLotesTratadosFromAllProduts(resultsDB);

            // PRIMEIRO PRECISEI PERCORRER TODOS OS RESULTADOS E ORDERNAR CADA LOTE INDIVIDUALMENTE
            // E COM ISSO RETORNA UM NOVO ARRAY DE OBJETO, PQ NAO ERA POSSIVEL RETORNA O
            // ANTIGO MODIFICADO
            const resultsTemp = sortProductsLotesByLotesExpDate(semTratados);
            // classifica os produtos em geral pelo o mais proximo de vencer
            // DEPOIS DE TER TODOS OS PRODUTOS COM OS SEUS LOTES ORDENADOS POR VENCIMENTO, SIMPLISMENTE PEGO O
            // PRIMEIRO LOTE DE CADA PRODUTO(JÁ QUE SEMPRE SERÁ O MAIS PROXIMO A VENCER) E FAÇO A ORDENAÇÃO
            // DE TODOS OS PRODUTOS BASEADO NESTE PRIMEIRO LOTE
            const results = sortProductsByFisrtLoteExpDate(resultsTemp);

            setProducts(results);
        } catch (error) {
            if (__DEV__) console.warn(error);
            else throw new Error(error);
        }
    }

    useEffect(() => {
        let realm;

        async function startRealm() {
            realm = await Realm();
            realm.addListener('change', () => getProduts(realm));

            getProduts(realm);
        }

        startRealm();

        return () => {
            realm.removeAllListeners();
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
