import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';

import Realm from '../../Services/Realm';

const TestDB = () => {
    useEffect(() => {
        async function RealmConnection() {
            const realm = await Realm();

            try {
                await realm.write(() => {
                    // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
                    // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
                    const lastProduct = realm
                        .objects('Product')
                        .sorted('id', true)[0];

                    console.log(lastProduct);

                    const nextId = lastProduct == null ? 1 : lastProduct.id + 1;

                    realm.create('Product', {
                        id: nextId,
                        name: 'ALGUMA COSISA',
                    });
                });
            } catch (err) {
                console.log(`erro ai: ${err}`);
            }

            try {
                const result = await realm.objects('Product');
            } catch (err) {
                Alert.alert(err);
            }
        }

        RealmConnection();
    }, []);

    return <View />;
};

export default TestDB;
