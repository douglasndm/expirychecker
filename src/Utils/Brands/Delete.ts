import realm from '@expirychecker/Services/Realm';

async function deleteBrand(brand_id: string): Promise<void> {
	realm.write(() => {
		const products = realm.objects<IProduct>('Product');

		const prodsToDelete = products.filter(prod => {
			if (String(prod.brand) === brand_id) return true;
			return false;
		});

		prodsToDelete.forEach(prod => {
			prod.brand = undefined;
		});
	});

	const brand = realm
		.objects<IBrand>('Brand')
		.filtered(`id == "${brand_id}"`)[0];

	realm.write(async () => {
		realm.delete(brand);
	});
}

export { deleteBrand };
