import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function updateBrand(brand: IBrand): Promise<void> {
	const brandsCollection = getCollectionPath();

	if (brandsCollection) {
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
