import {
	removeProductsWithoutBatchesFromList,
	removeTreatedBatchesFromList,
} from '@expirychecker/Utils/Products/Helpers';

const product1: IProduct = {
	id: 1,
	name: 'Product 1',
	code: 'P1',
	store: 'Store A',
	photo: 'https://example.com/product1.jpg',
	daysToBeNext: 30,
	categories: ['Category A'],
	batches: [],
};

const product2: IProduct = {
	id: 2,
	name: 'Product 2',
	code: 'P2',
	store: 'Store B',
	photo: 'https://example.com/product2.jpg',
	daysToBeNext: 45,
	categories: ['Category B'],
	batches: [
		{
			id: 1,
			name: 'Batch 1',
			exp_date: new Date(),
			status: 'Não tratado',
		},
		{ id: 2, name: 'Batch 2', exp_date: new Date(), status: 'Tratado' },
	],
};

const product3: IProduct = {
	id: 3,
	name: 'Product 3',
	code: 'P3',
	store: 'Store C',
	photo: 'https://example.com/product3.jpg',
	daysToBeNext: 60,
	categories: ['Category A', 'Category B'],
	batches: [
		{ id: 1, name: 'Batch 1', exp_date: new Date(), status: 'Tratado' },
		{ id: 2, name: 'Batch 2', exp_date: new Date(), status: 'Tratado' },
		{
			id: 3,
			name: 'Batch 3',
			exp_date: new Date(),
			status: 'Não tratado',
		},
	],
};

const product4: IProduct = {
	id: 4,
	name: 'Product 4',
	code: 'P4',
	store: 'Store B',
	photo: 'https://example.com/product2.jpg',
	daysToBeNext: 45,
	categories: ['Category B'],
	batches: [
		{
			id: 1,
			name: 'Batch 1',
			exp_date: new Date(),
			status: 'Não tratado',
		},
		{ id: 2, name: 'Batch 2', exp_date: new Date(), status: 'Não tratado' },
	],
};

describe('removeProductsWithoutBatchesFromList', () => {
	it('should remove products without batches', () => {
		const productList: IProduct[] = [product1, product2, product3];
		const result = removeProductsWithoutBatchesFromList(productList);
		expect(result).toEqual([product2, product3]); // Only product2 and product3 have batches
	});

	it('should return empty array if all products have no batches', () => {
		const productList: IProduct[] = [product1];
		const result = removeProductsWithoutBatchesFromList(productList);
		expect(result).toEqual([]); // product1 has no batches, so result should be empty
	});

	it('should return the same list if all products have batches', () => {
		const productList: IProduct[] = [product2, product3];
		const result = removeProductsWithoutBatchesFromList(productList);
		expect(result).toEqual([product2, product3]); // Both products have batches, so result should be the same
	});
});

describe('removeTreatedBatchesFromList', () => {
	it('should return the original list when there are no treated batches', () => {
		const products = [product1, product4];
		const result = removeTreatedBatchesFromList(products);
		expect(result).toEqual(products);
	});

	it('should return a list with treated batches removed', () => {
		const products = [product1, product2, product3, product4];

		const result = removeTreatedBatchesFromList(products);

		expect(result).toHaveLength(4);
		expect(result[0].batches.length).toBe(0);
		expect(result[1].batches.length).toBe(1);
		expect(result[2].batches.length).toBe(1);
		expect(result[3].batches.length).toBe(2);

		expect(result[1].batches[0].name).toBe(product2.batches[0].name);
		expect(result[2].batches[0].name).toBe(product3.batches[2].name);
		expect(result[3].batches[0].name).toBe(product4.batches[0].name);
		expect(result[3].batches[1].name).toBe(product4.batches[1].name);
	});
});
