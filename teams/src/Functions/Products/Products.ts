import { startOfDay, parseISO } from 'date-fns';

import API from '~/Services/API';

import { removeCheckedBatches, sortBatches } from './Batches';

interface removeProductsWithCheckedBatchesProps {
    products: Array<IProduct>;
}

export function removeProductsWithCheckedBatches({
    products,
}: removeProductsWithCheckedBatchesProps): Array<IProduct> {
    const prodsWithoutBatches = products.filter(p => {
        const batches = removeCheckedBatches(p.batches);

        if (batches.length > 0) {
            return true;
        }
        return false;
    });

    return prodsWithoutBatches;
}

interface getAllProductsProps {
    team_id: string;
}

export async function getAllProducts({
    team_id,
}: getAllProductsProps): Promise<Array<IProduct>> {
    try {
        if (!team_id) {
            throw new Error('Provider team id');
        }

        const response = await API.get<IAllTeamProducts>(
            `/team/${team_id}/products`
        );

        if (response) {
            return response.data.products;
        }

        return [];
    } catch (err) {
        if (!err.response) {
            throw new Error('Network error');
        }
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface sortProductsByBatchesExpDateProps {
    products: Array<IProduct>;
}

export function sortProductsByBatchesExpDate({
    products,
}: sortProductsByBatchesExpDateProps): Array<IProduct> {
    const prodsWithSortedBatchs = products.sort((prod1, prod2) => {
        const batches1 = sortBatches(prod1.batches);
        const batches2 = sortBatches(prod2.batches);

        // if one of the products doesnt have batches it will return
        // the another one as biggest
        if (batches1.length > 0 && batches2.length <= 0) {
            return -1;
        }
        if (batches1.length === 0 && batches2.length === 0) {
            return 0;
        }
        if (batches1.length <= 0 && batches2.length > 0) {
            return 1;
        }

        const batch1ExpDate = startOfDay(parseISO(batches1[0].exp_date));
        const batch2ExpDate = startOfDay(parseISO(batches2[0].exp_date));

        if (
            batches1[0].status === 'unchecked' &&
            batches2[0].status === 'checked'
        ) {
            return -1;
        }
        if (
            batches1[0].status === 'checked' &&
            batches2[0].status === 'checked'
        ) {
            if (batch1ExpDate > batch2ExpDate) {
                return 1;
            }
            if (batch1ExpDate === batch2ExpDate) {
                return 0;
            }
            if (batch1ExpDate < batch2ExpDate) {
                return -1;
            }
        }
        if (
            batches1[0].status === 'unchecked' &&
            batches2[0].status === 'checked'
        ) {
            return 1;
        }

        if (batch1ExpDate > batch2ExpDate) {
            return 1;
        }
        if (batch1ExpDate === batch2ExpDate) {
            return 0;
        }
        if (batch1ExpDate < batch2ExpDate) {
            return -1;
        }
        return 0;
    });

    return prodsWithSortedBatchs;
}
