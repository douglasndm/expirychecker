import realm from '@expirychecker/Services/Realm';

import { deleteImage } from '@expirychecker/Utils/Products/Images/Delete';

async function deleteProduct(productId: number): Promise<void> {
	const product = realm.objectForPrimaryKey<IProduct>('Product', productId);

	if (product && product.photo) {
		await deleteImage(product.photo);
	}

	realm.write(async () => {
		realm.delete(product);
	});
}

export { deleteProduct };
