import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

import { findProductByCode } from '@expirychecker/Utils/Products/Product/Find';
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
		result = realm
			.objects<IProduct>('Product')
			.filtered(`code = "${productCode}" AND store = "${store}"`)[0];
	}

	return result;
}

interface createProductProps {
	product: Omit<IProduct, 'id'>;
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
	let brand: IBrand | string | null = null;
	let store: IStore | string | null = null;

	if (product.brand) {
		if (typeof product.brand === 'string') {
			brand = product.brand;
		} else if (typeof product.brand === 'object') {
			brand = product.brand.id;
		}
	}

	if (product.store) {
		if (typeof product.store === 'string') {
			store = product.store;
		} else if (typeof product.store === 'object') {
			store = product.store.id;
		}
	}

	realm.write(() => {
		const prod = {
			...product,
			brand,
			store,
			updated_at: new Date(),
		};

		realm.create('Product', prod, UpdateMode.Modified);
	});
}
