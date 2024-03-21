export default class Migration {
	static migrate(oldRealm: Realm, newRealm: Realm) {
		if (oldRealm.schemaVersion <= 12) {
			const oldProducts = oldRealm.objects<IProduct>('Product');
			const newProducts = newRealm.objects<IProduct>('Product');

			for (let i = 0; i < oldProducts.length; i++) {
				newProducts[i]._id = String(oldProducts[i].id);
			}

			const oldBatches = oldRealm.objects<IBatch>('Lote');
			const newBatches = newRealm.objects<IBatch>('Lote');

			for (let i = 0; i < oldBatches.length; i++) {
				newBatches[i]._id = String(oldBatches[i].id);
			}

			const oldBrands = oldRealm.objects<IBrand>('Brand');
			const newBrands = newRealm.objects<IBrand>('Brand');

			for (let i = 0; i < oldBrands.length; i++) {
				newBrands[i]._id = oldBrands[i].id;
			}

			const oldCategories = oldRealm.objects<ICategory>('Category');
			const newCategories = newRealm.objects<ICategory>('Category');

			for (let i = 0; i < oldCategories.length; i++) {
				newCategories[i]._id = oldCategories[i].id;
			}

			const oldStores = oldRealm.objects<IStore>('Store');
			const newStores = newRealm.objects<IStore>('Store');

			for (let i = 0; i < oldStores.length; i++) {
				newStores[i]._id = oldStores[i].id;
			}
		}
	}
}
