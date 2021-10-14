import { startOfDay } from 'date-fns';

import Realm from '~/Services/Realm';

export function sortBatches(batches: Array<ILote>): Array<ILote> {
    // Gambiarra para .sort da função funcionar
    // por algum motivo sem isso sort é undefined
    const fixed = batches.map(batch => batch);

    const sorted = fixed.sort((batch1, batch2) => {
        const date1 = startOfDay(batch1.exp_date);
        const date2 = startOfDay(batch2.exp_date);

        if (date1 > date2) {
            return 1;
        }
        if (date1 < date2) {
            return -1;
        }

        return 0;
    });

    return sorted;
}

export function removeCheckedBatches(batches: Array<ILote>): Array<ILote> {
    const filted = batches.filter(batch => batch.status !== 'checked');

    return filted;
}

export async function saveManyBatches(batches: Array<ILote>): Promise<ILote[]> {
    const realm = await Realm();

    const lastBatch = realm.objects<ILote>('Lote').sorted('id', true)[0];
    let nextId = lastBatch == null ? 1 : lastBatch.id + 1;

    const createdBatches: Array<ILote> = [];

    realm.write(() => {
        batches.forEach(batch => {
            const createdBatch = realm.create<ILote>('Lote', {
                ...batch,
                id: nextId,
            });

            createdBatches.push(createdBatch);

            nextId += 1;
        });
    });

    return createdBatches;
}
