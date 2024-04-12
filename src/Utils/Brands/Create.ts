import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import realm from '@expirychecker/Services/Realm';

import strings from '@expirychecker/Locales';

import { getAllBrands } from './All';

function createBrandOnRealm(brand: IBrand): void {
	realm.write(() => {
		realm.create<IBrand>('Brand', brand, UpdateMode.Never);
	});
}

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

	createBrandOnRealm(brand);

	return brand;
}

export { createBrand };
