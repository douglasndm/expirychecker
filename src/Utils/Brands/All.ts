import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

function getAllBrandsFromRealm(): IBrand[] {
	return realm.objects<IBrand>('Brand').slice();
}

async function getAllBrands(): Promise<IBrand[]> {
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

export { getAllBrands };
