import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function deleteBrand(brand_id: string): Promise<void> {
	const brandsCollection = getCollectionPath();

	if (brandsCollection) {
		const findedBrand = await brandsCollection
			.where('id', '==', brand_id)
			.get();

		if (findedBrand.docs.length <= 0) {
			throw new Error('Brand not found');
		}

		findedBrand.docs[0].ref.delete();
	}

	realm.write(() => {
		const products = realm.objects<IProduct>('Product');

		const prodsToDelete = products.filter(prod => {
			if (String(prod.brand) === brand_id) return true;
			return false;
		});

		prodsToDelete.forEach(prod => {
			prod.brand = undefined;
		});
	});

	const brand = realm
		.objects<IBrand>('Brand')
		.filtered(`id == "${brand_id}"`)[0];

	realm.write(async () => {
		realm.delete(brand);
	});
}

export { deleteBrand };
