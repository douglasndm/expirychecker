import { getAllCategories } from '@expirychecker/Utils/Categories/All';

jest.mock('@expirychecker/Services/Realm', () => ({
	objects: (type: string) => {
		if (type === 'Category') {
			return [
				{
					id: 1,
					name: 'Category 1',
				},
				{
					id: 2,
					name: 'Category 2',
				},
			];
		}
		return [];
	},
}));

describe('getAllCategories', () => {
	it('should return an array of categories', async () => {
		const result = await getAllCategories();

		expect(result).toEqual([
			{ id: 1, name: 'Category 1' },
			{ id: 2, name: 'Category 2' },
		]);
	});
});
