import { Notifications } from 'react-native-notifications';
import { addDays, isPast } from 'date-fns';
import crashlytics from '@react-native-firebase/crashlytics';

import { getHowManyDaysToBeNextExp, getEnableNotifications } from './Settings';
import Realm from '../Services/Realm';

export async function getAllProductsNextToExp(): Promise<void> {
    const isNotifcationEnabled = await getEnableNotifications();

    if (!isNotifcationEnabled) return;

    const daysToBeNext = await getHowManyDaysToBeNextExp();

    try {
        const products = Realm.objects<IProduct>('Product')
            .filtered("lotes.@count > 0 AND lotes.status != 'Tratado'")
            .slice();

        const productsNextFiltered = products.map((p) => {
            const lotes = p.lotes.slice();

            const lotesFiltered = lotes.filter((l) => {
                if (
                    l.exp_date < addDays(new Date(), daysToBeNext) &&
                    !isPast(l.exp_date) &&
                    l.status !== 'Tratado'
                ) {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                lotes: lotesFiltered,
            };
        });

        const productsVencidosFiltered = products.map((p) => {
            const lotes = p.lotes.slice();

            const lotesFiltered = lotes.filter((l) => {
                if (isPast(l.exp_date) && l.status !== 'Tratado') {
                    return true;
                }

                return false;
            });

            return {
                ...p,
                lotes: lotesFiltered,
            };
        });

        let productsNextToExpCount = 0;
        let productsVencidosCount = 0;

        productsNextFiltered.forEach((p) => {
            productsNextToExpCount += p.lotes.length;
        });

        productsVencidosFiltered.forEach((p) => {
            productsVencidosCount += p.lotes.length;
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
