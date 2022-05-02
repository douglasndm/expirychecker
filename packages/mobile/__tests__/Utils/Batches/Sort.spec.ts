import { addDays, subDays } from 'date-fns';

import { sortBatches } from '~/Utils/Batches/Sort';

describe('Batches functions', () => {
    it('Should sort batches', () => {
        const date1 = addDays(new Date(), 2);
        const date2 = subDays(new Date(), 2);
        const date3 = new Date();

        const batch1: ILote = {
            id: 1,
            lote: 'Test 01',
            exp_date: date1,
        };

        const batch2: ILote = {
            id: 2,
            lote: 'Test 02',
            exp_date: date2,
        };
        const batch3: ILote = {
            id: 3,
            lote: 'Test 03',
            exp_date: date3,
        };

        const batches: ILote[] = [];

        batches.push(batch1);
        batches.push(batch2);
        batches.push(batch3);

        const sorted = sortBatches(batches);

        expect(sorted[0].exp_date).toBe(date2);
        expect(sorted[1].exp_date).toBe(date3);
        expect(sorted[2].exp_date).toBe(date1);
    });
});
