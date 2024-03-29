import firestore from '@react-native-firebase/firestore';
import UUID from 'react-native-uuid-generator';

import { getCollectionPath as getBrandsCollectionPath } from '@expirychecker/Utils/Brands/Collection';
import { getAllFirestoreData } from '@expirychecker/Utils/Database/Firestore/GetAll';

async function saveFirestoreData(data: IAppData): Promise<void> {
	const { brands: brandsToSave } = data;
	const { brands } = await getAllFirestoreData();

	const brandsCollection = await getBrandsCollectionPath();

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
}

export { saveFirestoreData };
