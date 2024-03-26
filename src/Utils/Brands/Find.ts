import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

function findBrandByNameOnRealm(name: string): IBrand | undefined {
	return realm.objects<IBrand>('Brand').filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive
}

async function findBrandByName(name: string): Promise<IBrand | undefined> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			return findBrandByNameOnRealm(name);
		}

		const brand = await brandsCollection.where('name', '==', name).get();

		return brand.docs[0].data() as IBrand;
	}

	return findBrandByNameOnRealm(name);
}

export { findBrandByName };
