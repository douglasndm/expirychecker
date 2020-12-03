import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { addDays } from 'date-fns';
import BackgroundJob from 'react-native-background-job';

import { useTheme } from 'styled-components/native';

import AsyncStorage from '@react-native-community/async-storage';
import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import {
    getEnableNotifications,
    setEnableNotifications,
} from '../../Functions/Settings';
import * as Premium from '../../Functions/Premium';
import { ExportBackupFile, ImportBackupFile } from '../../Functions/Backup';
import { getAllProductsNextToExp } from '../../Functions/ProductsNotifications';
import { Category } from '../Settings/styles';

import { Container } from './styles';

const Test: React.FC = () => {
    function setBackgroundJob() {
        const backgroundSchedule = {
            jobKey: 'backgroundNotification',
        };

        BackgroundJob.schedule(backgroundSchedule)
            .then(() => console.log('Success'))
            .catch((err) => {
                if (__DEV__) {
                    console.warn(err);
                }
            });
    }

    function note() {
        getAllProductsNextToExp();
    }

    async function sampleData() {
        try {
            Realm.write(() => {
                for (let i = 0; i < 50; i++) {
                    const lastProduct = Realm.objects('Product').sorted(
                        'id',
                        true
                    )[0];
                    const nextProductId =
                        lastProduct == null ? 1 : lastProduct.id + 1;

                    const lastLote = Realm.objects('Lote').sorted(
                        'id',
                        true
                    )[0];
                    const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

                    Realm.create('Product', {
                        id: nextProductId,
                        name: `Product ${i}`,
                        code: `${i}7841686${i}`,
                        lotes: [
                            {
                                id: nextLoteId,
                                lote: `ABC${i}xyz`,
                                exp_date: addDays(new Date(), 1 * i),
                                amount: i,
                                status: 'Não tratado',
                            },
                        ],
                    });
                }
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    async function deleteProducts() {
        try {
            Realm.write(() => {
                const results = Realm.objects('Product');

                Realm.delete(results);
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    async function getNot() {
        const noti = await getEnableNotifications();

        if (noti) {
            Alert.alert('Habilitado');
        } else {
            Alert.alert('Desabilitado');
        }
    }

    const handleInvertEnableNotification = useCallback(async () => {
        const notification = await getEnableNotifications();

        await setEnableNotifications(!notification);
    }, []);

    const handleExportFile = useCallback(async () => {
        await ExportBackupFile();
    }, []);

    const handleImportFile = useCallback(async () => {
        await ImportBackupFile();
    }, []);

    const theme = useTheme();

    const handleDeleteMigrateStatus = useCallback(async () => {
        await AsyncStorage.removeItem('MigrationStatus');
    }, []);

    return (
        <Container>
            <Category
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <Button
                    text="Remover status de migração do banco de dados das configurações"
                    onPress={handleDeleteMigrateStatus}
                />

                <Button text="Notification Status" onPress={getNot} />
                <Button
                    text="Invert Notification Status"
                    onPress={handleInvertEnableNotification}
                />

                <Button
                    text="Check play store"
                    onPress={async () => {
                        console.log(await Premium.IsPlayStoreIsAvailable());
                    }}
                />

                <Button
                    text="Logar detalhes da inscrição"
                    onPress={async () => {
                        console.log(await Premium.GetSubscriptionInfo());
                    }}
                />

                <Button
                    text="Logar se usuário tem inscrição ativa"
                    onPress={async () => {
                        console.log(
                            await Premium.CheckIfSubscriptionIsActive()
                        );
                    }}
                />

                <Button
                    text="Solicitar compra"
                    onPress={async () => {
                        console.log(await Premium.MakeASubscription());
                    }}
                />

                <Button text="Disparar notificação" onPress={note} />

                <Button text="Load with sample data" onPress={sampleData} />

                <Button text="Delete all products" onPress={deleteProducts} />

                <Button text="Background job" onPress={setBackgroundJob} />

                <Button text="Import file" onPress={handleImportFile} />

                <Button text="Export file" onPress={handleExportFile} />
            </Category>
        </Container>
    );
};

export default Test;
