import realm from '@expirychecker/Services/Realm';

async function getBrand(id: string): Promise<IBrand> {
	const realmResponse = realm
		.objects<IBrand>('Brand')
		.filtered(`id = "${id}"`)[0];

	return realmResponse;
}

export { getBrand };
