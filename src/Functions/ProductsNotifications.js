import { Notifications } from 'react-native-notifications';
import { addDays, isPast } from 'date-fns';

import { getDaysToBeNextToExp } from './Settings';
import Realm from '../Services/Realm';

export async function getAllProductsNextToExp() {
    const daysToBeNext = await getDaysToBeNextToExp();

    try {
        const realm = await Realm();

        const products = realm
            .objects('Product')
            .filtered("lotes.@count > 0 AND lotes.status != 'Tratado'")
            .slice();

        const productsNextFiltered = products.map((p) => {
            const lotes = p.lotes.slice();

            const lotesFiltered = lotes.filter((l) => {
                if (
                    l.exp_date < addDays(new Date(), daysToBeNext) &&
                    !isPast(l.exp_date, new Date()) &&
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
                if (isPast(l.exp_date, new Date()) && l.status !== 'Tratado') {
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

        productsNextFiltered.map((p) => {
            productsNextToExpCount += p.lotes.length;
        });

        productsVencidosFiltered.map((p) => {
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
        } else {
            NotificationTitle = 'Tudo certo.';
            NotificationMessage =
                'Você não tem nenhum produto próximo ao vencimento.';
        }

        Notifications.postLocalNotification({
            title: NotificationTitle,
            body: NotificationMessage,
        });
    } catch (err) {
        console.tron(err);
    }
}
