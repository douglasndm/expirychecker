import Auth from '@react-native-firebase/auth';
import Firestore, {
	FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

function getCollectionPath():
	| FirebaseFirestoreTypes.CollectionReference<FirebaseFirestoreTypes.DocumentData>
	| undefined {
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
