import auth from '@react-native-firebase/auth';
import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import Realm from '@expirychecker/Services/Realm';

import { getCollectionPath as getBrandsCollectionPath } from '@expirychecker/Utils/Brands/Collection';

async function sync() {
	const user = auth().currentUser;
	if (!user || !user.email) {
		console.log('User is not logged, not syncing Realm with Firestore');
		return;
	}

	console.log('User is logged, syncing Realm with Firestore');

	const brands = Realm.objects<IBrand>('Brand');
	const realmBrands = Array.from(brands);

	const firestoreBrands: FirebaseFirestoreTypes.DocumentData[] = [];

	const brandsCollection = getBrandsCollectionPath();

	if (brandsCollection) {
		const batch = firestore().batch();

		const brandsQuerySnapshot = await brandsCollection.get();

		brandsQuerySnapshot.forEach(documentSnapshot => {
			firestoreBrands.push(documentSnapshot);
		});

		realmBrands.forEach(realmBrand => {
			const firestoreBrand = firestoreBrands.find(
				brand => brand.id === realmBrand.id
			);

			if (firestoreBrand) {
				// Se a marca já existe no Firestore, atualize-a
				const findedBrand = firestoreBrands.find(
					fBrand => fBrand.id === realmBrand.id
				);

				if (findedBrand) {
					batch.update(findedBrand.ref, {
						name: realmBrand.name,
					});
				}
			} else {
				// Se a marca não existe no Firestore, adicione-a
				batch.set(brandsCollection.doc(realmBrand.id), {
					id: realmBrand.id,
					name: realmBrand.name,
				});
			}
		});

		// Remover marcas do Firestore que não existem no Realm
		firestoreBrands.forEach(firestoreBrand => {
			const realmBrand = realmBrands.find(
				brand => brand.id === firestoreBrand.id
			);

			if (!realmBrand) {
				// Se a marca não existe no Realm, remova-a do Firestore
				const findedBrand = firestoreBrands.find(
					fBrand => fBrand.id === firestoreBrand.id
				);

				if (findedBrand) {
					batch.delete(findedBrand.ref);
				}
			}
		});

		await batch.commit();
		console.log('Synced Firestore with Realm');
	}
}

sync();
