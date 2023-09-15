import realm from '@expirychecker/Services/Realm';

async function getAllCategories(): Promise<Array<ICategory>> {
	const realmResponse = realm.objects<ICategory>('Category').slice();

	return realmResponse;
}

export { getAllCategories };
