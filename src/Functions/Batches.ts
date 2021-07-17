import { startOfDay } from 'date-fns';

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
