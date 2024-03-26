import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function findBrandByName(name: string): Promise<IBrand> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			throw new Error('Brands collection not found');
		}

		const brand = await brandsCollection.where('name', '==', name).get();

		return brand.docs[0].data() as IBrand;
	}

	const realmResponse = realm
		.objects<IBrand>('Brand')
		.filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive

	return realmResponse;
}

export { findBrandByName };
