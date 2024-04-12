import realm from '@expirychecker/Services/Realm';

async function saveManyBrands(brandsToSave: IBrand[]): Promise<void> {
	realm.write(() => {
		brandsToSave.forEach(brand => {
			const alreadyExists = realm
				.objects<IBrand>('Brand')
				.filtered(`name ==[c] "${brand.name}"`)[0]; // ==[c] makes the search insensitive

			if (!alreadyExists) {
				realm.create('Brand', brand);
			}
		});
	});
}

export { saveManyBrands };
