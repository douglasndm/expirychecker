import Realm from '@expirychecker/Services/Realm';

async function saveRealmData(data: IAppData): Promise<void> {
	const { brands } = data;

	Realm.write(() => {
		brands.forEach(brand => {
			const alreadyExists = Realm.objects<IBrand>('Brand').filtered(
				`name ==[c] "${brand.name}"`
			)[0]; // ==[c] makes the search insensitive

			if (!alreadyExists) {
				Realm.create('Brand', brand);
			}
		});
	});
}

export { saveRealmData };
