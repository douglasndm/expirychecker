import { sortStores } from '@expirychecker/Utils/Stores/Sort';

describe('sortStores', () => {
	it('should sort stores alphabetically by name', () => {
		const stores: IStore[] = [
			{ id: '1', name: 'Zebra' },
			{ id: '2', name: 'apple' },
			{ id: '3', name: 'zealot' },
			{ id: '4', name: 'Banana' },
		];

		const sortedStores = sortStores(stores);

		expect(sortedStores).toEqual([
			{ id: '2', name: 'apple' },
			{ id: '4', name: 'Banana' },
			{ id: '3', name: 'zealot' },
			{ id: '1', name: 'Zebra' },
		]);
	});

	it('should not modify the original array', () => {
		const stores: IStore[] = [
			{ id: '1', name: 'store A' },
			{ id: '2', name: 'store C' },
			{ id: '3', name: 'store B' },
		];

		const sortedStores = sortStores(stores);

		expect(stores).toEqual(sortedStores);
	});
});
