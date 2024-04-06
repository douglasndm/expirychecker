import auth from '@react-native-firebase/auth';
import firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import realm from '@expirychecker/Services/Realm';

import { getAllRealmData } from '@expirychecker/Utils/Database/Realm/GetAll';
import { saveRealmData } from '@expirychecker/Utils/Database/Realm/Save';
import { getAllFirestoreData } from '@expirychecker/Utils/Database/Firestore/GetAll';
import { saveFirestoreData } from '@expirychecker/Utils/Database/Firestore/Save';
import { getCollectionPath as getBrandsCollectionPath } from '@expirychecker/Utils/Brands/Collection';
import { deleteAllData } from '@expirychecker/Utils/Database/Delete';

async function deleteAllFirestoreData(): Promise<void> {
	await deleteAllData({ keepRealmData: true, keepImages: true });
}

async function deleteAllRealmData(): Promise<void> {
	// It will delete all data in the realm and keep firestore data
	await deleteAllData({ keepFirestoreData: true });
}

async function sync(): Promise<void> {
	const initialSyncDone = await AsyncStorage.getItem('initialSync');
	if (!initialSyncDone) {
		console.log('Initial sync not done, not syncing Realm with Firestore');
		return;
	}

	const user = auth().currentUser;
	if (!user || !user.email) {
		console.log('User is not logged, not syncing Realm with Firestore');
		return;
	}

	const { brands: realmBrands } = await getAllRealmData();

	console.log('User is logged, syncing Realm with Firestore');

	const firestoreBrands: FirebaseFirestoreTypes.DocumentData[] = [];

	const brandsCollection = await getBrandsCollectionPath();

	// if brandsCollection exists, user already had data at firestore
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

export type InitalSyncProps =
	| 'keepBothData'
	| 'deleteRealmData'
	| 'deleteFirestoreData';

async function initialSync(props: InitalSyncProps): Promise<void> {
	if (props === 'deleteRealmData') {
		await deleteAllRealmData();

		const firestoreBrands: FirebaseFirestoreTypes.DocumentData[] = [];

		const brandsCollection = await getBrandsCollectionPath();

		// if brandsCollection exists, user already had data at firestore
		if (brandsCollection) {
			const brandsQuerySnapshot = await brandsCollection.get();

			brandsQuerySnapshot.forEach(documentSnapshot => {
				firestoreBrands.push(documentSnapshot.data());
			});

			realm.write(() => {
				firestoreBrands.forEach(brand => {
					realm.create('Brand', brand);
				});
			});
		}
	}
	if (props === 'deleteFirestoreData') {
		await deleteAllFirestoreData();

		// set initialSync to true here allow sync function to work
		await AsyncStorage.setItem('initialSync', 'true');
		// sync will copy data from realm and add it to firestore
		await sync();

		return;
	}

	if (props === 'keepBothData') {
		// need to copy missing data from firestore to realm
		// need to copy missing data from realm to firestore

		const { brands: realmBrands } = await getAllRealmData();
		const { brands: firestoreBrands } = await getAllFirestoreData();

		const missingBrandsAtRealm = firestoreBrands.filter(brand => {
			return !realmBrands.find(
				rBrand => rBrand.name.toLowerCase() === brand.name.toLowerCase()
			);
		});

		console.log('missingBrandsAtRealm', missingBrandsAtRealm);

		const missingBrandsAtFirestore = realmBrands.filter(brand => {
			return !firestoreBrands.find(
				fBrand => fBrand.name.toLowerCase() === brand.name.toLowerCase()
			);
		});

		console.log('missingBrandsAtFirestore', missingBrandsAtFirestore);
		await saveRealmData({ brands: missingBrandsAtRealm });
		await saveFirestoreData({ brands: missingBrandsAtFirestore });
	}

	await AsyncStorage.setItem('initialSync', 'true');
}

sync();

export { initialSync, sync };
