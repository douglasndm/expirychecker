import Realm from '@expirychecker/Services/Realm';

async function getAllRealmData(): Promise<IAppData> {
	const brands = Realm.objects<IBrand>('Brand');
	const realmBrands: IBrand[] = brands.map(brand => {
		return {
			id: brand.id,
			name: brand.name,
		};
	});

	const appData: IAppData = {
		brands: realmBrands,
	};

	return appData;
}

export { getAllRealmData };
