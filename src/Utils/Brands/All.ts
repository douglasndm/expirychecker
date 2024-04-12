import realm from '@expirychecker/Services/Realm';

async function getAllBrands(): Promise<IBrand[]> {
	return realm.objects<IBrand>('Brand').slice();
}

export { getAllBrands };
