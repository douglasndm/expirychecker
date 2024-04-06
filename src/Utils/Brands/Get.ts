import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function getBrand(id: string): Promise<IBrand> {
	const brandsCollection = await getCollectionPath();

	if (brandsCollection) {
		const brand = await brandsCollection.where('id', '==', id).get();

		if (brand.docs.length <= 0) {
			throw new Error('Brand not found');
		}

		const brandData = brand.docs[0].data();

		return {
			id: brandData.id,
			name: brandData.name,
			created_at: brandData.created_at
				? brandData.created_at.toDate()
				: undefined,
			updated_at: brandData?.updated_at
				? brandData.updated_at.toDate()
				: undefined,
		};
	}

	const realmResponse = realm
		.objects<IBrand>('Brand')
		.filtered(`id = "${id}"`)[0];

	return realmResponse;
}

export { getBrand };
