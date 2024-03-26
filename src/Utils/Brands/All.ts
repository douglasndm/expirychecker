import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function getAllBrands(): Promise<Array<IBrand>> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brands: IBrand[] = [];

		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			throw new Error('Brands collection not found');
		}

		const brandsQuerySnapshot = await brandsCollection.get();

		brandsQuerySnapshot.forEach(documentSnapshot => {
			brands.push(documentSnapshot.data() as IBrand);
		});

		return brands;
	}

	const realmResponse = realm.objects<IBrand>('Brand').slice();

	return realmResponse;
}

export { getAllBrands };
