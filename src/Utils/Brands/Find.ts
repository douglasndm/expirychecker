import realm from '@expirychecker/Services/Realm';

async function findBrandByName(name: string): Promise<IBrand | undefined> {
	return realm.objects<IBrand>('Brand').filtered(`name ==[c] "${name}"`)[0]; // ==[c] makes the search insensitive
}

export { findBrandByName };
