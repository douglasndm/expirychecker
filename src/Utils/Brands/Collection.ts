import Auth from '@react-native-firebase/auth';
import Firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function getCollectionPath(): Promise<
	| FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>
	| undefined
> {
	const initialSyncDone = await AsyncStorage.getItem('initialSync');
	if (!initialSyncDone) {
		// console.log('Initial sync not done, not syncing Realm with Firestore');
		return undefined;
	}
	const user = Auth().currentUser;

	if (user && user.email) {
		const usersCollection = Firestore().collection('users');
		const userDoc = usersCollection.doc(user.email);
		const brandsCollection = userDoc.collection('brands');

		return brandsCollection;
	}

	return undefined;
}

export { getCollectionPath };
