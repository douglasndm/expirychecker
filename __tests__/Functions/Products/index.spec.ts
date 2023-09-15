import { getAllProducts } from '@expirychecker/Functions/Products/index';

// create a mock version of react-native-fs
jest.mock('react-native-fs', () => ({
	// create a mock version of the actual function
	exists: jest.fn(() => Promise.resolve(true)),
	unlink: jest.fn(() => Promise.resolve(true)),
}));

// create a mock version of realm so we don't depend on its actual implementation during tests
jest.mock('@expirychecker/Services/Realm', () => ({
	objects: (type: string) => {
		if (type === 'Product') {
			return [
				{
					id: 1,
					name: 'Product A',
					batches: [
						{
							id: 1,
							exp_date: new Date('2022-01-31'),
							status: 'Não tratado',
						},
						{
							id: 2,
							exp_date: new Date('2021-12-15'),
							status: 'Não tratado',
						},
					],
				},
				{
					id: 2,
					name: 'Product B',
					batches: [
						{
							id: 3,
							exp_date: new Date('2022-02-28'),
							status: 'Tratado',
						},
						{
							id: 4,
							exp_date: new Date('2020-03-31'),
							status: 'Não tratado',
						},
					],
				},
				{
					id: 3,
					name: 'Product C',
					batches: [],
				},
			];
		}
		return [];
	},
}));

describe('getAllProducts()', () => {
	it('should return all products with all batches when no options are given', async () => {
		const products = await getAllProducts({});
		expect(products).toHaveLength(3);
		expect(products[0].name).toEqual('Product A');
		expect(products[0].batches).toHaveLength(2);
		expect(products[1].name).toEqual('Product B');
		expect(products[1].batches).toHaveLength(2);
		expect(products[2].name).toEqual('Product C');
		expect(products[2].batches).toHaveLength(0);
	});

	it('should remove products without batches if option is set to true', async () => {
		const products = await getAllProducts({
			removeProductsWithoutBatches: true,
		});

		expect(products.length).toBe(2);
		expect(products[0].name).toEqual('Product A');
		expect(products[0].batches).toHaveLength(2);
		expect(products[1].name).toEqual('Product B');
		expect(products[1].batches).toHaveLength(2);
	});

	it('should remove treated batches from all products if option is set to true', async () => {
		const products = await getAllProducts({ removeTreatedBatch: true });
		expect(products).toHaveLength(3);
		expect(products[0].name).toEqual('Product A');
		expect(products[0].batches).toHaveLength(2);
		expect(products[1].name).toEqual('Product B');
		expect(products[1].batches).toHaveLength(1);
		expect(products[2].name).toEqual('Product C');
		expect(products[2].batches).toHaveLength(0);
	});

	it('should sort batches by expiration date for each product if option is set to true', async () => {
		const products = await getAllProducts({ sortProductsByExpDate: true });
		expect(products).toHaveLength(3);
		expect(products[0].name).toEqual('Product B');
		expect(products[0].batches[0].exp_date).toEqual(new Date('2020-03-31'));
		expect(products[0].batches[1].exp_date).toEqual(new Date('2022-02-28'));
		expect(products[1].name).toEqual('Product A');
		expect(products[1].batches[0].exp_date).toEqual(new Date('2021-12-15'));
		expect(products[1].batches[1].exp_date).toEqual(new Date('2022-01-31'));
	});

	it('should limit the number of products returned if option is passed', async () => {
		const products = await getAllProducts({ limit: 2 });
		expect(products).toHaveLength(2);
		expect(products[0].name).toEqual('Product A');
		expect(products[1].name).toEqual('Product B');
	});
});
