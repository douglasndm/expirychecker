import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
    removeAllLotesTratadosFromAllProduts,
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';
import { CheckIfSubscriptionIsActive } from '../../Functions/Premium';

import Header from '../../Components/Header';
import FABProducts from '../../Components/FABProducts';
import Notification from '../../Components/Notification';
import ListProducts from '../../Components/ListProducts';

import RealmContext from '../../Contexts/RealmContext';

import { Container, InputSearch } from './styles';

interface HomeProps {
    notificationToUser?: string;
}

const Home: React.FC<HomeProps> = ({ notificationToUser }: HomeProps) => {
    const { Realm } = useContext(RealmContext);

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [error, setError] = useState<string>();

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

    useEffect(() => {
        if (notificationToUser) setSnackBarVisible(true);
    }, [notificationToUser]);

    useEffect(() => {
        async function checkIfUserIsPremium() {
            await CheckIfSubscriptionIsActive();
        }

        checkIfUserIsPremium();
    }, []);

    async function getProduts(realm: Realm) {
        try {
            const resultsDB = realm
                .objects<IProduct>('Product')
                .filtered('lotes.@count > 0 AND lotes.status != "Tratado"')
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
        async function startRealm() {
            Realm.addListener('change', () => getProduts(Realm));

            getProduts(Realm);
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
                const productsFind = products.filter((product) => {
                    return !!product.name
                        .toLowerCase()
                        .includes(search.toLowerCase());
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

            <InputSearch
                placeholder="Pesquisar por um produto"
                value={searchString}
                onChangeText={handleSearchChange}
            />

            <ListProducts products={productsSearch} isHome />
            {snackBarVisible && notificationToUser && (
                <Notification NotificationMessage={notificationToUser} />
            )}
            {!notificationToUser && error && (
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
