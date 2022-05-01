import { sortStores } from '~/Utils/Stores/Sort';

describe('Stores functions', () => {
    it('Should sort stores', () => {
        const store1: IStore = {
            id: 'Test ID',
            name: 'XYZ',
        };
        const store2: IStore = {
            id: 'Test ID',
            name: 'CGF',
        };
        const store3: IStore = {
            id: 'Test ID',
            name: 'ABC',
        };

        const stores: IStore[] = [];
        stores.push(store1);
        stores.push(store2);
        stores.push(store3);

        const sorted = sortStores(stores);

        expect(sorted[0].name).toBe('ABC');
        expect(sorted[1].name).toBe('CGF');
        expect(sorted[2].name).toBe('XYZ');
    });
});
