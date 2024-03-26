import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

function getAllBrandsFromRealm(): Array<IBrand> {
	return realm.objects<IBrand>('Brand').slice();
}

async function getAllBrands(): Promise<Array<IBrand>> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brands: IBrand[] = [];

		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			return getAllBrandsFromRealm();
		}

		const brandsQuerySnapshot = await brandsCollection.get();

		brandsQuerySnapshot.forEach(documentSnapshot => {
			brands.push(documentSnapshot.data() as IBrand);
		});

		return brands;
	}

	return getAllBrandsFromRealm();
}

export { getAllBrands };
