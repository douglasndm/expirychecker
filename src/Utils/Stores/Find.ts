import realm from '~/Services/Realm';

async function getAllStores(): Promise<IStore[]> {
    const realmResponse = realm.objects<IStore>('Store').slice();

    return realmResponse;
}

export { getAllStores };
