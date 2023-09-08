import realm from '@expirychecker/Services/Realm';

async function getAllProductsWithoutCategory(): Promise<Array<IProduct>> {
	const products = realm.objects<IProduct>('Product').slice();

	const filtedProducts = products.filter(p => {
		if (p.categories.length === 0 || p.categories === null) return true;

		return false;
	});

	return filtedProducts;
}

export { getAllProductsWithoutCategory };
