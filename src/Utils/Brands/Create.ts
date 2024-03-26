import { UpdateMode } from 'realm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UUID from 'react-native-uuid-generator';

import realm from '@expirychecker/Services/Realm';

import strings from '@expirychecker/Locales';

import { getCollectionPath } from './Collection';
import { getAllBrands } from './All';

async function createBrand(brandName: string): Promise<IBrand> {
	const brands = await getAllBrands();

	const alreadyExists = brands.find(
		brand => brand.name.toLowerCase() === brandName.toLowerCase()
	);

	if (alreadyExists) {
		throw new Error(
			strings.View_Brand_List_InputAdd_Error_BrandAlreadyExists
		);
	}

	const brandUuid = await UUID.getRandomUUID();

	const brand: IBrand = {
		id: brandUuid,
		name: brandName.trim(),
	};

	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		const brandsCollection = getCollectionPath();

		if (!brandsCollection) {
			throw new Error('Brands collection not found');
		}

		await brandsCollection.add({
			id: brand.id,
			name: brand.name,
		});
	}

	realm.write(() => {
		realm.create<IBrand>('Brand', brand, UpdateMode.Never);
	});

	return brand;
}

export { createBrand };