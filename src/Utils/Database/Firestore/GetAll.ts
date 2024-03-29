import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { getCollectionPath as getBrandsCollectionPath } from '@expirychecker/Utils/Brands/Collection';

async function getAllFirestoreData(): Promise<IAppData> {
	const firestoreBrands: FirebaseFirestoreTypes.DocumentData[] = [];

	const brandsCollection = await getBrandsCollectionPath();

	if (brandsCollection) {
		const brandsQuerySnapshot = await brandsCollection.get();

		brandsQuerySnapshot.forEach(documentSnapshot => {
			firestoreBrands.push(documentSnapshot.data() as IBatch);
		});
	}

	const brands = firestoreBrands.map(brand => {
		return {
			id: brand.id,
			name: brand.name,
		};
	});

	const appData: IAppData = {
		brands,
	};

	return appData;
}

export { getAllFirestoreData };
