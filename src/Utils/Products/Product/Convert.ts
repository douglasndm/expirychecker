import Realm from '@expirychecker/Services/Realm';

function cleanBatch(batch: any): IBatch {
	return {
		id: batch.id,
		// Apesar do mapeamento interno para 'lote', você pode usar 'name' para o objeto limpo
		name: batch.name,
		exp_date: batch.exp_date ? new Date(batch.exp_date) : new Date(), // ou undefined se preferir
		amount: batch.amount,
		price: batch.price,
		status: batch.status,
		price_tmp: batch.price_tmp,
		where_is: batch.where_is,
		additional_data: batch.additional_data,
		created_at: batch.created_at ? new Date(batch.created_at) : undefined,
		updated_at: batch.updated_at ? new Date(batch.updated_at) : undefined,
	};
}

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
		batches: Array.isArray(realmProduct.batches)
			? realmProduct.batches.map((batch: any) => cleanBatch(batch))
			: [],

		created_at: realmProduct.created_at || new Date(),
		updated_at: realmProduct.updated_at || new Date(),
	};

	return product;
}

export { convertRealmProductToProduct };
