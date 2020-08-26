import React, { useState, useEffect } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

import Realm from '../../Services/Realm';
import {
    removeAllLotesTratadosFromAllProduts,
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';
import { CheckIfSubscriptionIsActive } from '../../Functions/Premium';

import FABProducts from '../../Components/FABProducts';
import ListProducts from '../../Components/ListProducts';

interface HomeProps {
    notificationToUser?: string;
}

const Home: React.FC<HomeProps> = ({ notificationToUser }: HomeProps) => {
    const theme = useTheme();

    const [snackBarVisible, setSnackBarVisible] = useState(false);
    const [products, setProducts] = useState<Array<IProduct>>([]);

    useEffect(() => {
        if (notificationToUser && notificationToUser !== '')
            setSnackBarVisible(true);
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
        } catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        let realm: Realm;

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
            <ListProducts products={products} isHome />

            {snackBarVisible && (
                <Snackbar
                    visible={snackBarVisible}
                    duration={5000}
                    style={{
                        backgroundColor: theme.colors.accent,
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
            )}

            <FABProducts />
        </>
    );
};

export default Home;
