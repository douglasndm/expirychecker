import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

function getAllBrandsFromRealm(): IBrand[] {
	return realm.objects<IBrand>('Brand').slice();
}

async function getAllBrands(): Promise<IBrand[]> {
	const brands: IBrand[] = [];

	const brandsCollection = await getCollectionPath();

	if (!brandsCollection) {
		return getAllBrandsFromRealm();
	}

	const brandsQuerySnapshot = await brandsCollection.get();

	brandsCollection.onSnapshot(snapshot => {
		if (!snapshot) {
			return;
		}

		const changes = snapshot.docChanges();

		changes.forEach(change => {
			const brand = change.doc.data();

			const updatedBrand = {
				id: brand.id,
				name: brand.name,
				created_at: brand.created_at
					? brand.created_at.toDate()
					: undefined,
				updated_at: brand?.updated_at
					? brand.updated_at.toDate()
					: undefined,
			};

			realm.write(() => {
				realm.create('Brand', updatedBrand, UpdateMode.Modified);
			});
		});
	});

	brandsQuerySnapshot.forEach(documentSnapshot => {
		brands.push(documentSnapshot.data() as IBrand);
	});

	return brands;
}

export { getAllBrands };
