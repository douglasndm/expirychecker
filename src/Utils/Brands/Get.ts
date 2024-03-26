import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function getBrand(id: string): Promise<IBrand> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			throw new Error('Brands collection not found');
		}

		const brand = await brandsCollection.where('id', '==', id).get();

		if (brand.docs.length <= 0) {
			throw new Error('Brand not found');
		}

		return brand.docs[0].data() as IBrand;
	}

	const realmResponse = realm
		.objects<IBrand>('Brand')
		.filtered(`id = "${id}"`)[0];

	return realmResponse;
}

export { getBrand };