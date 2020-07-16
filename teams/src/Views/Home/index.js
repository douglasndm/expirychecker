import React, { useState, useEffect } from 'react';
import { Snackbar } from 'react-native-paper';

import Realm from '../../Services/Realm';
import { sortLoteByExpDate } from '../../functions/lotes';

import FABProducts from '../../Components/FABProducts';
import ListProducts from '../../Components/ListProducts';

export default function Home({ notificationToUser }) {
    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (notificationToUser && notificationToUser !== '')
            setSnackBarVisible(true);
    }, [notificationToUser]);

    async function getProduts(realm) {
        try {
            const resultsDB = realm.objects('Product').slice();

            // PRIMEIRO PRECISEI PERCORRER TODOS OS RESULTADOS E ORDERNAR CADA LOTE INDIVIDUALMENTE
            // E COM ISSO RETORNA UM NOVO ARRAY DE OBJETO, PQ NAO ERA POSSIVEL RETORNA O
            // ANTIGO MODIFICADO
            const resultsTemp = resultsDB.map((result) => {
                const lotesSorted = sortLoteByExpDate(result.lotes);

                return {
                    id: result.id,
                    name: result.name,
                    code: result.code,
                    lotes: lotesSorted,
                };
            });

            // classifica os produtos em geral pelo o mais proximo de vencer
            // DEPOIS DE TER TODOS OS PRODUTOS COM OS SEUS LOTES ORDENADOS POR VENCIMENTO, SIMPLISMENTE PEGO O
            // PRIMEIRO LOTE DE CADA PRODUTO(JÁ QUE SEMPRE SERÁ O MAIS PROXIMO A VENCER) E FAÇO A ORDENAÇÃO
            // DE TODOS OS PRODUTOS BASEADO NESTE PRIMEIRO LOTE
            const results = resultsTemp.sort((item1, item2) => {
                if (item1.lotes[0].exp_date > item2.lotes[0].exp_date) return 1;
                if (item1.lotes[0].exp_date < item2.lotes[0].exp_date)
                    return -1;
                return 0;
            });

            if (results.length > 10) {
                const resultsMin = [];

                for (let i = 0; i < 10; i++) resultsMin.push(results[i]);

                setProducts(resultsMin);
            } else {
                setProducts(results);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function startRealm() {
            const realm = await Realm();
            realm.addListener('change', () => getProduts(realm));

            getProduts(realm);
        }

        startRealm();
    }, []);

    return (
        <>
            <ListProducts products={products} isHome />

            {snackBarVisible ? (
                <Snackbar
                    visible={snackBarVisible}
                    duration={5000}
                    style={{
                        backgroundColor: '#14d48f',
                        borderRadius: 12,
                        marginBottom: 90,
                        padding: 7,
                        opacity: 0.95,
                    }}
                    theme={{ colors: { accent: 'white' } }}
                    onDismiss={() => setSnackBarVisible(false)}
                    action={{
                        label: 'fechar',
                        accessibilityLabel: 'Fechar notificação',
                        onPress: () => {
                            setSnackBarVisible(false);
                        },
                    }}
                >
                    {notificationToUser}
                </Snackbar>
            ) : null}

            <FABProducts />
        </>
    );
}
