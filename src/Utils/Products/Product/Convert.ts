import Realm from '@expirychecker/Services/Realm';

function convertRealmProductToProduct(realmProduct: RealmProduct): IProduct {
	let brand: IBrand | undefined;
	let category: ICategory | undefined;
	let store: IStore | undefined;

	if (realmProduct.brand) {
		if (typeof realmProduct.brand === 'string') {
			const realmBrand = Realm.objectForPrimaryKey<IBrand>(
				'Brand',
				realmProduct.brand
			);

			if (realmBrand) {
				brand = {
					id: realmBrand.id,
					name: realmBrand.name,
				};
			}
		}
	}

	if (realmProduct.categories && realmProduct.categories.length > 0) {
		if (typeof realmProduct.categories[0] === 'string') {
			const realmCategory = Realm.objectForPrimaryKey<ICategory>(
				'Category',
				realmProduct.categories[0]
			);

			if (realmCategory) {
				category = {
					id: realmCategory.id,
					name: realmCategory.name,
				};
			}
		}
	}

	if (realmProduct.store) {
		if (typeof realmProduct.store === 'string') {
			const realmStore = Realm.objectForPrimaryKey<IStore>(
				'Store',
				realmProduct.store
			);

			if (realmStore) {
				store = {
					id: realmStore.id,
					name: realmStore.name,
				};
			}
		}
	}

	const product: IProduct = {
		id: String(realmProduct.id),
		name: realmProduct.name,
		code: realmProduct.code,
		photo: realmProduct.photo,
		daysToBeNext: realmProduct.daysToBeNext,
		brand,
		category,
		store,
		batches: realmProduct.batches,

		created_at: realmProduct.created_at || new Date(),
		updated_at: realmProduct.updated_at || new Date(),
	};

	return product;
}

export { convertRealmProductToProduct };
