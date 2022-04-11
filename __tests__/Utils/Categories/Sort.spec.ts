import { sortCategories } from '~/Utils/Categories/Sort';

describe('Categories functions', () => {
    it('Should sort categories', () => {
        const cat1: ICategory = {
            id: 'Test ID',
            name: 'XYZ',
        };
        const cat2: ICategory = {
            id: 'Test ID',
            name: 'CGF',
        };
        const cat3: ICategory = {
            id: 'Test ID',
            name: 'ABC',
        };

        const categories: ICategory[] = [];
        categories.push(cat1);
        categories.push(cat2);
        categories.push(cat3);

        const sorted = sortCategories(categories);

        expect(sorted[0].name).toBe('ABC');
        expect(sorted[1].name).toBe('CGF');
        expect(sorted[2].name).toBe('XYZ');
    });
});
