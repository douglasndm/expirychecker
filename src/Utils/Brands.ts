import realm from '@expirychecker/Services/Realm';

export async function getAllProductsByBrand(
	brand_id: string
): Promise<Array<IProduct>> {
	const products = realm.objects<IProduct>('Product').slice();

	const filtedProducts = products.filter(p => {
		return String(p.brand) === brand_id;
	});

	return filtedProducts;
}
