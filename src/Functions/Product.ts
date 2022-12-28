import { UpdateMode } from 'realm';
import { exists, unlink } from 'react-native-fs';

import realm from '@expirychecker/Services/Realm';

import { createLote } from './Lotes';
import { getProductImagePath } from './Products/Image';
import { saveManyBatches } from './Batches';

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

export async function getProductById(productId: number): Promise<IProduct> {
	const result = realm
		.objects<IProduct>('Product')
		.filtered(`id = "${productId}"`)[0];

	return result;
}

interface createProductProps {
	product: Omit<IProduct, 'id'>;
	ignoreDuplicate?: boolean;
}

export async function createProduct({
	product,
	ignoreDuplicate = false,
}: createProductProps): Promise<void | number> {
	if (product.code) {
		const productExist = await checkIfProductAlreadyExistsByCode({
			productCode: product.code,
			productStore: product?.store,
		});

		if (productExist) {
			const productLotes = product.batches.slice();

			if (productLotes.length < 1 && ignoreDuplicate === false) {
				throw new Error(
					'Produto já existe. Não há lotes para adicionar'
				);
			}

			productLotes.map(async l => {
				await createLote({
					productCode: product.code,
					lote: l,
					ignoreDuplicate,
				});
			});
		}
	}

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
			categories: product.categories,
			lotes: [],
		});
	});

	await saveManyBatches(product.batches);

	return nextProductId;
}

interface updateProductProps {
	id: number;
	name?: string;
	code?: string;
	store?: string | null;
	brand?: string | null;
	photo?: string;
	daysToBeNext?: number | undefined;
	categories?: Array<string>;
	lotes?: Array<ILote>;
}

export async function updateProduct(
	product: updateProductProps
): Promise<void> {
	realm.write(() => {
		realm.create('Product', product, UpdateMode.Modified);
	});
}

export async function deleteProduct(productId: number): Promise<void> {
	const product = realm
		.objects<IProduct>('Product')
		.filtered(`id == ${productId}`)[0];

	const photoPath = await getProductImagePath(productId);

	if (photoPath) {
		if (await exists(photoPath)) {
			await unlink(photoPath);
		}
	}

	realm.write(async () => {
		realm.delete(product);
	});
}
