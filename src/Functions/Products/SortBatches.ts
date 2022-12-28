import { startOfDay, addDays } from 'date-fns';

import { getHowManyDaysToBeNextExp } from '@expirychecker/Functions/Settings';

interface sortByBatchesExpTypeResponse {
	expired: IProduct[];
	nextToExp: IProduct[];
	normal: IProduct[];
}

async function sortByBatchesExpType(
	products: IProduct[]
): Promise<sortByBatchesExpTypeResponse> {
	const daysToBeNext = await getHowManyDaysToBeNextExp();
	const now = startOfDay(new Date());

	const expired_prod: IProduct[] = [];
	const nextToExp_prod: IProduct[] = [];
	const normal_prod: IProduct[] = [];

	products.forEach(prod => {
		let have_expired = false;
		let have_next = false;

		prod.batches.forEach(batch => {
			const batchDate = startOfDay(batch.exp_date);

			if (batchDate <= now) {
				have_expired = true;
			} else if (prod.daysToBeNext && prod.daysToBeNext > 0) {
				const dateToCheck = startOfDay(
					addDays(new Date(), prod.daysToBeNext)
				);

				if (batchDate <= dateToCheck) {
					have_next = true;
				}
			} else if (
				batchDate <= startOfDay(addDays(new Date(), daysToBeNext))
			) {
				have_next = true;
			}
		});

		if (have_expired) {
			expired_prod.push(prod);
		} else if (have_next) {
			nextToExp_prod.push(prod);
		} else {
			normal_prod.push(prod);
		}
	});

	return {
		expired: expired_prod,
		nextToExp: nextToExp_prod,
		normal: normal_prod,
	};
}

export { sortByBatchesExpType };
