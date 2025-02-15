import { addDays, endOfDay, isPast, startOfDay } from 'date-fns';

import strings from '@shared/Locales';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';

import { getHowManyDaysToBeNextExp } from './Settings';
import { removeAllLotesTratadosFromAllProduts } from './Products';

export async function getNotificationForAllProductsCloseToExp(): Promise<INotification | null> {
	const daysToBeNext = await getHowManyDaysToBeNextExp();

	const prods = await getAllProductsAsync({
		removeProductsWithoutBatches: true,
	});
	const products = removeAllLotesTratadosFromAllProduts(prods);

	const productsNextFiltered: IProduct[] = products.map(p => {
		const lotes = p.batches.slice();

		const lotesFiltered = lotes.filter(l => {
			if (l.status && l.status.toLowerCase() !== 'tratado') {
				if (p.daysToBeNext && p.daysToBeNext > 0) {
					const dateToCheck = startOfDay(
						addDays(new Date(), p.daysToBeNext)
					);

					if (l.exp_date <= dateToCheck) {
						return true;
					}
				} else if (
					l.exp_date < addDays(new Date(), daysToBeNext) &&
					!isPast(l.exp_date)
				) {
					return true;
				}
			}

			return false;
		});

		return {
			...p,
			batches: lotesFiltered,
		};
	});

	const productsVencidosFiltered: IProduct[] = products.map(p => {
		const lotes = p.batches.slice();

		const lotesFiltered = lotes.filter(l => {
			if (
				isPast(endOfDay(l.exp_date)) &&
				l.status?.toLowerCase() !== 'tratado'
			) {
				return true;
			}

			return false;
		});

		return {
			...p,
			batches: lotesFiltered,
		};
	});

	let productsNextToExpCount = 0;
	let productsVencidosCount = 0;

	productsNextFiltered.forEach(p => {
		productsNextToExpCount += p.batches.length;
	});

	productsVencidosFiltered.forEach(p => {
		productsVencidosCount += p.batches.length;
	});

	let NotificationTitle;
	let NotificationMessage;

	if (productsNextToExpCount > 0 && productsVencidosCount === 0) {
		NotificationTitle =
			strings.Function_Notification_ItOnlyHasProductsNextToExpTitle;
		NotificationMessage =
			strings.Function_Notification_ItOnlyHasProductsNextToExpMessage.replace(
				'{NUMBER}',
				String(productsNextToExpCount)
			);
	} else if (productsNextToExpCount === 0 && productsVencidosCount > 0) {
		NotificationTitle =
			strings.Function_Notification_ItOnlyHasExpiredProductsTitle;
		NotificationMessage =
			strings.Function_Notification_ItOnlyHasExpiredProductsMessage.replace(
				'{NUMBER}',
				String(productsVencidosCount)
			);
	} else if (productsNextToExpCount > 0 && productsVencidosCount > 0) {
		NotificationTitle =
			strings.Function_Notification_ItHasExpiredAndNextToExpireProductsTitle;
		NotificationMessage =
			strings.Function_Notification_ItHasExpiredAndNextToExpireProductsMessage.replace(
				'{EXPIREDNUMBER}',
				String(productsVencidosCount)
			);
	}

	if (!!NotificationTitle && !!NotificationMessage) {
		const notification: INotification = {
			title: NotificationTitle,
			message: NotificationMessage,
			amount: productsVencidosCount + productsNextToExpCount,
		};

		return notification;
	}

	return null;
}
