import { UpdateMode } from 'realm';
import firestore from '@react-native-firebase/firestore';

import realm from '@expirychecker/Services/Realm';

import { getCollectionPath } from './Collection';

async function updateBrand(brand: IBrand): Promise<void> {
	const brandsCollection = await getCollectionPath();

	const updatedBrand: IBrand = {
		...brand,
		id: brand.id,
		name: brand.name,

		updated_at: new Date(),
	};

	if (brandsCollection) {
		const findedBrand = await brandsCollection
			.where('id', '==', updatedBrand.id)
			.get();

		if (findedBrand.docs.length === 0) {
			throw new Error('Brand not found');
		}

		await findedBrand.docs[0].ref.set(
			{
				...updatedBrand,
				updated_at: firestore.FieldValue.serverTimestamp(),
			},
			{ merge: true }
		);
	}

	realm.write(() => {
		realm.create('Brand', updatedBrand, UpdateMode.Modified);
	});
}
export { updateBrand };
