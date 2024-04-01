import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAllRealmData } from '@expirychecker/Utils/Database/Realm/GetAll';
import { getAllFirestoreData } from '@expirychecker/Utils/Database/Firestore/GetAll';

async function isInitialSyncNeeded(): Promise<boolean> {
	const initialSyncDone = await AsyncStorage.getItem('initialSync');

	if (initialSyncDone) {
		return false;
	}

	const { brands: realmBrands } = await getAllRealmData();
	const { brands: firestoreBrands } = await getAllFirestoreData();

	if (realmBrands.length > 0 && firestoreBrands.length > 0) {
		return true;
	}

	return false;
}

export { isInitialSyncNeeded };
