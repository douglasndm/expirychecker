import { UpdateMode } from 'realm';
import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function updateBrand(brand: IBrand): Promise<void> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			throw new Error('Brands collection not found');
		}

		const findedBrand = await brandsCollection
			.where('id', '==', brand.id)
			.get();

		if (findedBrand.docs.length === 0) {
			throw new Error('Brand not found');
		}

		await findedBrand.docs[0].ref.set(brand, { merge: true });
	}
	realm.write(() => {
		realm.create('Brand', brand, UpdateMode.Modified);
	});
}
export { updateBrand };
