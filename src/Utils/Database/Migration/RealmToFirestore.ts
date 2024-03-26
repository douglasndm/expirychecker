import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Realm from '@expirychecker/Services/Realm';

async function migrateBrands(): Promise<void> {
	const migratedBrands = await AsyncStorage.getItem('migratedBrands');

	if (migratedBrands) {
		return;
	}

	const brands = Realm.objects<IBrand>('Brand');
	const brandsArray = Array.from(brands);

	const user = auth().currentUser;
	if (!user || !user.email) {
		return;
	}

	// Create a new batch instance
	const batch = firestore().batch();

	const usersCollection = firestore().collection('users');
	const userDoc = usersCollection.doc(user.email);
	const brandsCollection = userDoc.collection('brands');

	brandsArray.forEach(brand => {
		batch.set(brandsCollection.doc(brand.id), {
			id: brand.id,
			name: brand.name,
		});
	});

	await batch.commit();

	await AsyncStorage.setItem('migratedBrands', 'true');
}

async function init() {
	if (!auth().currentUser) {
		console.log('User is not logged, not migrating');
		return;
	}

	await migrateBrands();
}

init();
