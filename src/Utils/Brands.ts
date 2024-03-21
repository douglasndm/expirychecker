import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import strings from '@expirychecker/Locales';

import realm from '@expirychecker/Services/Realm';

export async function getBrand(id: string): Promise<IBrand> {
	const realmResponse = realm
		.objects<IBrand>('Brand')
		.filtered(`id = "${id}"`)[0];

	return realmResponse;
}

export async function getAllBrands(): Promise<Array<IBrand>> {
	const realmResponse = realm.objects<ICategory>('Brand').slice();

	return realmResponse;
}

export async function createBrand(brandName: string): Promise<IBrand> {
	const brands = await getAllBrands();

	const alreadyExists = brands.find(
		brand => brand.name.toLowerCase() === brandName.toLowerCase()
	);

	if (alreadyExists) {
		throw new Error(
			strings.View_Brand_List_InputAdd_Error_BrandAlreadyExists
		);
	}

	const brandUuid = await UUID.getRandomUUID();

	const brand: IBrand = {
		_id: brandUuid,
		id: brandUuid,
		name: brandName.trim(),
	};

	realm.write(() => {
		realm.create<IBrand>('Brand', brand, UpdateMode.Never);
	});

	return brand;
}

export async function updateBrand(brand: IBrand): Promise<void> {
	realm.write(() => {
		realm.create('Brand', brand, UpdateMode.Modified);
	});
}

export async function getAllProductsByBrand(
	brand_id: string
): Promise<Array<IProduct>> {
	const products = realm.objects<IProduct>('Product').slice();

	const filtedProducts = products.filter(p => {
		return p.brand === brand_id;
	});

	return filtedProducts;
}

export async function deleteBrand({
	brand_id,
}: deleteBrandProps): Promise<void> {
	realm.write(() => {
		const products = realm.objects<IProduct>('Product');

		const prodsToDelete = products.filter(prod => {
			if (prod.brand === brand_id) return true;
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

export async function saveManyBrands(brands: Array<IBrand>): Promise<void> {
	realm.write(() => {
		brands.forEach(brand => {
			const alreadyExists = realm
				.objects<IBrand>('Brand')
				.filtered(`name ==[c] "${brand.name}"`)[0]; // ==[c] makes the search insensitive

			if (!alreadyExists) {
				realm.create('Brand', brand);
			}
		});
	});
}
