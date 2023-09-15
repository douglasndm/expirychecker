import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

export async function getCategory(id: string): Promise<ICategory> {
	const realmResponse = realm
		.objects<ICategory>('Category')
		.filtered(`id = "${id}"`)[0];

	return realmResponse;
}

export async function updateCategory(category: ICategory): Promise<void> {
	realm.write(() => {
		realm.create('Category', category, UpdateMode.Modified);
	});
}

export async function getAllProductsByCategory(
	categoryUuid: string
): Promise<Array<IProduct>> {
	const products = realm.objects<IProduct>('Product').slice();

	const filtedProducts = products.filter(p => {
		const isInCategory = p.categories.find(c => c === categoryUuid);

		if (isInCategory) return true;
		return false;
	});

	return filtedProducts;
}

interface deleteCategoryProps {
	category_id: string;
}

export async function deleteCategory({
	category_id,
}: deleteCategoryProps): Promise<void> {
	realm.write(() => {
		const products = realm.objects<IProduct>('Product');

		const prodsToDelete = products.filter(prod => {
			const inc = prod.categories.find(cat => cat === category_id);

			if (inc && inc.length > 0) {
				return true;
			}
			return false;
		});

		prodsToDelete.forEach(prod => {
			prod.categories = [];
		});
	});

	const product = realm
		.objects<ICategory>('Category')
		.filtered(`id == "${category_id}"`)[0];

	realm.write(async () => {
		realm.delete(product);
	});
}
