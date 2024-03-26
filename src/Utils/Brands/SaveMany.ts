import firestore from '@react-native-firebase/firestore';
import UUID from 'react-native-uuid-generator';

import realm from '@expirychecker/Services/Realm';

import { getAllBrands } from './All';
import { getCollectionPath } from './Collection';

async function saveManyBrands(brandsToSave: Array<IBrand>): Promise<void> {
	const brands = await getAllBrands();

	const brandsCollection = getCollectionPath();

	if (brandsCollection) {
		const brandsThatNotExist = brandsToSave.filter(brand => {
			const alreadyExists = brands.find(
				b => b.name.toLowerCase() === brand.name.toLowerCase()
			);

			return !alreadyExists;
		});
		const batch = firestore().batch();

		brandsThatNotExist.forEach(async brand => {
			let { id } = brand;

			if (!id) {
				id = await UUID.getRandomUUID();
			}

			batch.set(brandsCollection.doc(id), {
				id,
				name: brand.name,
			});
		});

		await batch.commit();
	}

	realm.write(() => {
		brandsToSave.forEach(brand => {
			const alreadyExists = realm
				.objects<IBrand>('Brand')
				.filtered(`name ==[c] "${brand.name}"`)[0]; // ==[c] makes the search insensitive

			if (!alreadyExists) {
				realm.create('Brand', brand);
			}
		});
	});
}

export { saveManyBrands };
