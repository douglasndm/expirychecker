import realm from '@expirychecker/Services/Realm';

async function findCategoryByName(name: string): Promise<ICategory> {
	const realmResponse = realm
		.objects<ICategory>('Category')
		.filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive

	return realmResponse;
}

export { findCategoryByName };
