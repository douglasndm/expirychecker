import { sortBrands } from '~/Utils/Brands/Sort';

describe('Brands functions', () => {
    it('Should sort brands', () => {
        const brand1: IBrand = {
            id: 'Test ID',
            name: 'XYZ',
        };
        const brand2: IBrand = {
            id: 'Test ID',
            name: 'CGF',
        };
        const brand3: IBrand = {
            id: 'Test ID',
            name: 'ABC',
        };

        const brands: IBrand[] = [];
        brands.push(brand1);
        brands.push(brand2);
        brands.push(brand3);

        const sorted = sortBrands(brands);

        expect(sorted[0].name).toBe('ABC');
        expect(sorted[1].name).toBe('CGF');
        expect(sorted[2].name).toBe('XYZ');
    });
});
