import Realm from '@expirychecker/Services/Realm';
import { findBrandByName } from '@expirychecker/Utils/Brands/Find';

// Mock the Realm object
jest.mock('@expirychecker/Services/Realm', () => {
	const objectsMock = {
		filtered: jest.fn(),
	};
	return { objects: jest.fn(() => objectsMock) };
});

describe('findBrandByName', () => {
	it('should return the matched brand when found', async () => {
		// Define mock data
		const inputName = 'Coca-Cola';
		const expectedBrand = { id: 1, name: inputName };

		// Configure the Realm mock to return our expected data
		(Realm.objects as jest.Mock).mockReturnValueOnce({
			filtered: jest.fn().mockReturnValueOnce([expectedBrand]),
		});

		// Invoke the function we want to test
		const result = await findBrandByName(inputName);

		// Assert that it returned our expected value
		expect(result).toEqual(expectedBrand);
	});

	it('should return null when no match is found', async () => {
		// Define mock data
		const inputName = 'Nonexistent Brand';

		// Configure the Realm mock to return an empty array
		(Realm.objects as jest.Mock).mockReturnValueOnce({
			filtered: jest.fn().mockReturnValueOnce([]),
		});

		// Invoke the function we want to test
		const result = await findBrandByName(inputName);

		// Assert that it returned null
		expect(result).toBeUndefined();
	});
});
