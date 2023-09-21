import realm from '@expirychecker/Services/Realm';

async function getAllStores(): Promise<IStore[]> {
	const realmResponse = realm.objects<IStore>('Store').slice();

	return realmResponse;
}

export { getAllStores };
