import React, { useState, useEffect } from 'react';

import Realm from '../../Services/Realm';

import FABProducts from '../../Components/FABProducts';
import ListProducts from '../../Components/ListProducts';

export default function Home() {
    const [products, setProducts] = useState([]);

    async function getProduts(realm) {
        try {
            const resultsDB = realm.objects('Product').slice();

            // classifica os produtos em geral pelo o mais proximo de vencer
            const results = resultsDB.sort((item1, item2) => {
                let lote1;
                let lote2;

                // Dentro de determinado produto, classica os lotes mais proximos
                if (item1.lotes.length > 1 && item2.lotes.length > 1) {
                    lote1 = item1.lotes.sort((lote1, lote2) => {
                        if (lote1.exp_date > lote2.exp_date) return 1;
                        if (lote1.exp_date < lote2.exp_date) return -1;
                        return 0;
                    });
                    lote2 = item2.lotes.sort((lote1, lote2) => {
                        if (lote1.exp_date > lote2.exp_date) return 1;
                        if (lote1.exp_date < lote2.exp_date) return -1;
                        return 0;
                    });
                } else {
                    lote1 = item1.lotes[0];
                    lote2 = item2.lotes[0];
                }

                if (lote1.exp_date > lote2.exp_date) return 1;
                if (lote1.exp_date < lote2.exp_date) return -1;
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

            <FABProducts />
        </>
    );
}
