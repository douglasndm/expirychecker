import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

function findBrandByNameOnRealm(name: string): IBrand | undefined {
	return realm.objects<IBrand>('Brand').filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive
}

async function findBrandByName(name: string): Promise<IBrand | undefined> {
	const brandsCollection = await getCollectionPath();

	if (!brandsCollection) {
		return findBrandByNameOnRealm(name);
	}

	const brand = await brandsCollection.where('name', '==', name).get();

	return brand.docs[0].data() as IBrand;
}

export { findBrandByName };
