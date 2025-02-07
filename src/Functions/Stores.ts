import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import strings from '@shared/Locales';

import { getAllStores } from '@expirychecker/Utils/Stores/Find';

import realm from '@expirychecker/Services/Realm';

// This is to detect UUID
const regularExpression = new RegExp(
	/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

export async function getStore(idOrName: string): Promise<IStore | null> {
	if (regularExpression.test(idOrName)) {
		const realmResponse = realm
			.objects<IStore>('Store')
			.filtered(`id = "${idOrName}"`);

		if (realmResponse.length <= 0) return null;

		return realmResponse[0];
	}

	return { id: '', name: idOrName };
}

// this return the store uuid
export async function createStore(storeName: string): Promise<IStore> {
	const stores = await getAllStores();

	const storeAlreadyExists = stores.find(
		store => store.name.toLowerCase() === storeName.toLowerCase()
	);

	if (storeAlreadyExists) {
		throw new Error(
			strings.View_Store_List_AddNewStore_Error_DuplicateStore
		);
	}

	const storeUUID = await UUID.getRandomUUID();

	const store: IStore = {
		id: storeUUID,
		name: storeName,
	};

	realm.write(() => {
		realm.create<IStore>('Store', store, UpdateMode.Never);
	});

	return store;
}

export async function updateStore(store: IStore): Promise<void> {
	realm.write(() => {
		realm.create('Store', store, UpdateMode.Modified);
	});
}

export async function deleteStore(store_id: string): Promise<void> {
	const allProductsByStore = realm
		.objects<IProduct[]>('Product')
		.filtered(`store = "${store_id}"`);

	const realmResponse = realm
		.objects<IStore>('Store')
		.filtered(`id = "${store_id}"`);

	realm.write(() => {
		realm.delete(allProductsByStore);
		realm.delete(realmResponse);
	});
}

export async function getAllProductsByStore(
	storeUUID: string | null
): Promise<Array<IProduct>> {
	const products = realm.objects<IProduct>('Product').slice();

	if (storeUUID === null) {
		const prods = products.filter(p => p.store === null || p.store === '');

		return prods;
	}

	const store = await getStore(storeUUID);

	const filtedProducts = products.filter(p => {
		let isInStore: boolean;

		if (p.store && p.store === storeUUID) {
			isInStore = true;
		} else if (store?.name && store.name === p.store) {
			isInStore = true;
		} else {
			isInStore = false;
		}

		if (isInStore) return true;
		return false;
	});

	return filtedProducts;
}
