import Realm from '@expirychecker/Services/Realm';

import { convertRealmProductToProduct } from './Convert';

async function getProductById(id: number): Promise<IProduct> {
	const product = Realm.objectForPrimaryKey<RealmProduct>('Product', id);

	if (!product) {
		throw new Error('Product not found');
	}

	const converted = convertRealmProductToProduct(product);

	return converted;
}

export { getProductById };
