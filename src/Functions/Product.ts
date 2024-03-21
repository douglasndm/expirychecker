import { UpdateMode } from 'realm';
import { exists, unlink } from 'react-native-fs';

import realm from '@expirychecker/Services/Realm';

import { getLocalImageFromProduct } from '@utils/Product/Image/GetLocalImage';

import { getBrand } from '@expirychecker/Utils/Brands';
import { findProductByCode } from '@expirychecker/Utils/Products/Product/Find';
import { getCategory } from './Category';
import { getStore } from './Stores';
import { createLote } from './Lotes';

interface ICheckIfProductAlreadyExistsByCodeProps {
	productCode: string;
	productStore?: string;
}

export async function checkIfProductAlreadyExistsByCode({
	productCode,
	productStore,
}: ICheckIfProductAlreadyExistsByCodeProps): Promise<boolean> {
	if (productStore) {
		const results = realm
			.objects('Product')
			.filtered(`code = "${productCode}" AND store = "${productStore}"`)
			.slice();

		if (results.length > 0) {
			return true;
		}
		return false;
	}

	const results = realm
		.objects('Product')
		.filtered(`code = "${productCode}" AND store = NULL`)
		.slice();

	if (results.length > 0) {
		return true;
	}
	return false;
}

export async function getProductByCode({
	productCode,
	store,
}: getProductByCodeProps): Promise<IProduct> {
	let result = realm
		.objects<IProduct>('Product')
		.filtered(`code = "${productCode}"`)[0];

	if (store) {
        result = realm // eslint-disable-line
			.objects<IProduct>('Product')
			.filtered(`code = "${productCode}" AND store = "${store}"`)[0];
	}

	return result;
}

// Get product by code asynchronosly
export async function getProductByCodeAsync({
	productCode,
	store,
}: getProductByCodeProps): Promise<IProduct> {
	return new Promise((resolve, reject) => {
		let result = realm
			.objects<IProduct>('Product')
			.filtered(`code = "${productCode}"`)[0];

		if (store) {
            result = realm // eslint-disable-line
				.objects<IProduct>('Product')
				.filtered(`code = "${productCode}" AND store = "${store}"`)[0];
		}

		if (result) {
			resolve(result);
		} else {
			reject(new Error('Produto não encontrado'));
		}
	});
}

export async function getProductById(productId: number): Promise<IProduct> {
	const result = realm
		.objects<IProduct>('Product')
		.filtered(`id = "${productId}"`)[0];

	if (!result) {
		throw new Error('Product not found');
	}

	const prod: IProduct = {
		_id: result._id,
		id: result.id,
		name: result.name,
		code: result.code,
		photo: result.photo,
		daysToBeNext: result.daysToBeNext,
		batches: result.batches,
		brand: result.brand,
		store: result.store,
		created_at: result.created_at,
		updated_at: result.updated_at,
	};

	if (result.categories && result.categories.length > 0) {
		const category = await getCategory(result.categories[0]);

		prod.category = category;
	}
	if (prod.brand) {
		const brand = await getBrand(String(prod.brand));

		prod.brand = brand;
	}
	if (prod.store) {
		const store = await getStore(String(prod.store));

		prod.store = store || undefined;
	}

	return prod;
}

interface createProductProps {
	product: Omit<IProduct, 'id' | '_id'>;
}

export async function createProduct({
	product,
}: createProductProps): Promise<void | number> {
	if (product.code) {
		const store_id = product.store?.id
			? product.store.id
			: String(product.store);

		const productAlreadyExists = await findProductByCode({
			code: product.code,
			store_id: store_id === 'undefined' ? undefined : store_id,
		});

		if (productAlreadyExists) {
			const productLotes = product.batches.slice();

			if (productLotes.length > 0) {
				await createLote({
					lote: productLotes[0],
					productId: productAlreadyExists.id,
					productCode: productAlreadyExists.code,
					ignoreDuplicate: true,
				});
			}

			return productAlreadyExists.id;
		}
	}

	const category_id = product.category?.id
		? product.category.id
		: String(product.category);

	// BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
	// UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
	const lastProduct = realm
		.objects<IProduct>('Product')
		.sorted('id', true)[0];
	const nextProductId = lastProduct == null ? 1 : lastProduct.id + 1;

	realm.write(async () => {
		realm.create('Product', {
			_id: String(nextProductId),
			id: nextProductId,
			name: product.name,
			code: product.code,
			photo: product.photo,
			daysToBeNext: product.daysToBeNext,
			brand: product.brand,
			store: product.store,
			categories: [category_id],
			lotes: [],
		});
	});

	const productBatches = product.batches.slice();

	if (productBatches.length > 0) {
		await createLote({
			lote: productBatches[0],
			productId: nextProductId,
			productCode: product.code,
			ignoreDuplicate: true,
		});
	}

	return nextProductId;
}

interface updateProductProps {
	_id: string;
	id: number;
	name?: string;
	code?: string;
	store?: string | IStore | null;
	brand?: string | IBrand | null;
	photo?: string;
	daysToBeNext?: number | undefined;
	categories?: Array<string>;
	batches?: Array<IBatch>;
}

export async function updateProduct(
	product: updateProductProps
): Promise<void> {
	realm.write(() => {
		const prod = {
			...product,
			brand:
				typeof product.brand === 'string'
					? product.brand
					: product.brand?.id,
			store:
				typeof product.store === 'string'
					? product.store
					: product.store?.id,
			updated_at: new Date(),
		};
		realm.create('Product', prod, UpdateMode.Modified);
	});
}

export async function deleteProduct(productId: number): Promise<void> {
	const product = realm
		.objects<IProduct>('Product')
		.filtered(`id == ${productId}`)[0];

	if (product.photo) {
		const photoPath = await getLocalImageFromProduct(product.photo);

		if (photoPath) {
			if (await exists(photoPath)) {
				await unlink(photoPath);
			}
		}
	}

	realm.write(async () => {
		realm.delete(product);
	});
}
