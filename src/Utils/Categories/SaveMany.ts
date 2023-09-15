import realm from '@expirychecker/Services/Realm';

export async function saveManyCategories(
	categories: Array<ICategory>
): Promise<void> {
	realm.write(() => {
		categories.forEach(cat => {
			const alreadyExists = realm
				.objects<ICategory>('Category')
				.filtered(`name ==[c] "${cat.name}"`)[0]; // ==[c] makes the search insensitive

			if (!alreadyExists) {
				realm.create('Category', cat);
			}
		});
	});
}
