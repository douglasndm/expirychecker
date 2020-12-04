import { Notifications } from 'react-native-notifications';
import { addDays, isPast } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';

import { getHowManyDaysToBeNextExp, getEnableNotifications } from './Settings';

import { getAllProductsWithBatches } from './Products';

export async function getAllProductsNextToExp(): Promise<void> {
    const isNotifcationEnabled = await getEnableNotifications();

    if (!isNotifcationEnabled) return;

    const daysToBeNext = await getHowManyDaysToBeNextExp();

    try {
        const allProducts = await getAllProductsWithBatches();

        const products = allProducts.map((p) => {
            const filtedBatches = p.batches.filter(
                (batch) => batch.status !== 'Tratado'
            );

            return {
                ...p,
                batches: filtedBatches,
            };
        });

        const productsWithBatchesNextToExp = products.map((p) => {
            const filteredBatches = p.batches.filter((batch) => {
                const batchDate = new Date(batch.exp_date);

                if (
                    batchDate < addDays(new Date(), daysToBeNext) &&
                    !isPast(batchDate)
                ) {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                batches: filteredBatches,
            };
        });

        const productWithExpiredBatches = products.map((p) => {
            const filteredBatches = p.batches.filter((batch) => {
                const batchDate = new Date(batch.exp_date);

                if (isPast(batchDate)) {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                batches: filteredBatches,
            };
        });

        let productsNextToExpCount = 0;
        let productsVencidosCount = 0;

        productsWithBatchesNextToExp.forEach((p) => {
            productsNextToExpCount += p.batches.length;
        });

        productWithExpiredBatches.forEach((p) => {
            productsVencidosCount += p.batches.length;
        });

        let NotificationTitle;
        let NotificationMessage;

        if (productsNextToExpCount > 0 && productsVencidosCount === 0) {
            NotificationTitle = 'Você tem produtos próximo ao vencimento.';
            NotificationMessage = `Você tem atualmente ${productsNextToExpCount} lotes próximos ao vencimento.`;
        } else if (productsNextToExpCount === 0 && productsVencidosCount > 0) {
            NotificationTitle = 'VOCÊ TEM PRODUTOS VENCIDOS!';
            NotificationMessage = `VOCÊ TEM ${productsVencidosCount} LOTES VENCIDOS SEM TRATAMENTOS.`;
        } else if (productsNextToExpCount > 0 && productsVencidosCount > 0) {
            NotificationTitle =
                'VOCÊ TEM PRODUTOS VENCIDOS E PRÓXIMOS AO VENCIMENTO!';
            NotificationMessage = `Você tem ${productsVencidosCount} lotes vencidos e ${productsNextToExpCount} lotes próximos ao vencimento`;
        }

        if (!!NotificationTitle && !!NotificationMessage) {
            Notifications.postLocalNotification(
                {
                    title: NotificationTitle,
                    body: NotificationMessage,
                },
                1
            );
        }
    } catch (err) {
        crashlytics().recordError(err);
        crashlytics().log('Falha ao enviar notificação');
        console.warn(err);
    }
}
