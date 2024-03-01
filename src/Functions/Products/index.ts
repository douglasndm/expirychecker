import { compareAsc, startOfDay } from 'date-fns';

import realm from '@expirychecker/Services/Realm';

import { sortBatches } from '@expirychecker/Utils/Batches/Sort';
import { removeLotesTratados } from '../Lotes';

export async function saveMany(
	products: Omit<IProduct, 'id'>[]
): Promise<void> {
	const lastProd = realm.objects<IProduct>('Product').sorted('id', true)[0];
	let nextProdId = lastProd == null ? 1 : lastProd.id + 1;

	realm.write(() => {
		products.forEach(prod => {
			const lastLote = realm
				.objects<IBatch>('Lote')
				.sorted('id', true)[0];
			let lastLoteId = lastLote == null ? 0 : lastLote.id;

			const batches = prod.batches.map(batch => {
				lastLoteId += 1;

				const batchName =
					batch.name !== 'undefined'
						? batch.name
						: String(lastLoteId);

				return {
					...batch,
					id: lastLoteId,
					name: batchName,
				};
			});

			let brand: IBrand | string | undefined;
			let category: ICategory | string | undefined;
			let store: IStore | string | undefined;

			if (prod.brand) {
				if (typeof prod.brand === 'string') {
					brand = prod.brand;
				} else {
					brand = prod.brand.id;
				}
			}

			if (prod.category) {
				if (typeof prod.category === 'string') {
					category = prod.category;
				} else {
					category = prod.category.id;
				}
			}

			if (prod.store) {
				if (typeof prod.store === 'string') {
					store = prod.store;
				} else {
					store = prod.store.id;
				}
			}

			const product: IProduct = {
				...prod,
				id: nextProdId,
				brand,
				category,
				store,
				batches,
			};
			realm.create('Product', product);

			nextProdId += 1;
		});
	});
}

// ESSA FUNÇÃO RECEBE UMA LISTA DE PRODUTOS E ORDERNAR CADA ARRAY DE LOTES DE CADA PRODUTO
// POR DATA DE VENCIMENTO, OU SEJA CADA PRODUTO DA LISTA VAI TER UM ARRAY DE LOTE JÁ ORDERNADO POR DATA DE VENCIMENTO
export function sortProductsLotesByLotesExpDate(
	listProducts: Array<IProduct>
): Array<IProduct> {
	const productsLotesSorted = listProducts.map(prod => {
		const prodLotesSorted = sortBatches(prod.batches);

		const product: IProduct = {
			id: prod.id,
			name: prod.name,
			code: prod.code,
			photo: prod.photo,
			brand: prod.brand,
			categories: prod.categories,
			daysToBeNext: prod.daysToBeNext,
			store: prod.store,
			batches: prodLotesSorted,
			created_at: prod.created_at,
			updated_at: prod.updated_at,
		};

		return product;
	});

	return productsLotesSorted;
}

// classifica os produtos em geral pelo o mais proximo de vencer
// ATENÇÃO QUE A FUNÇÃO SÓ PEGA O PRIMEIRO VALOR DO ARRAY DE LOTES, OU SEJA
// É ESPERADO QUE O ARRAY DE LOTES JÁ TENHA SIDO ORDERNADO ANTES
export function sortProductsByFisrtLoteExpDate(
	listProducts: Array<IProduct>
): Array<IProduct> {
	const results = listProducts.sort((item1, item2) => {
		if (item1.batches.length === 0 && item2.batches.length > 0) {
			return 1;
		}
		if (item1.batches.length > 0 && item2.batches.length === 0) {
			return -1;
		}

		if (item1.batches !== null && item1.batches.length > 0) {
			if (item2.batches !== null && item2.batches.length > 0) {
				if (item1.batches[0].exp_date > item2.batches[0].exp_date)
					return 1;
				if (item1.batches[0].exp_date < item2.batches[0].exp_date)
					return -1;
				return 0;
			}

			return 1;
		}

		return -1;
	});

	return results;
}

export function removeAllLotesTratadosFromAllProduts(
	listProducts: Array<IProduct>
): Array<IProduct> {
	const results = listProducts.map(prod => {
		const product: IProduct = {
			id: prod.id,
			name: prod.name,
			code: prod.code,
			store: prod.store,
			photo: prod.photo,
			categories: prod.categories,
			daysToBeNext: prod.daysToBeNext,
			batches: removeLotesTratados(prod.batches),
		};
		return product;
	});

	return results;
}

interface getAllProductsProps {
	removeProductsWithoutBatches?: boolean;
	removeTreatedBatch?: boolean;
	sortProductsByExpDate?: boolean;
	limit?: number;
}

export function getAllProducts({
	removeProductsWithoutBatches = false,
	removeTreatedBatch = false,
	sortProductsByExpDate = false,
	limit,
}: getAllProductsProps): IProduct[] {
	let filteredProducts = [...realm.objects<IProduct>('Product')];

	if (removeProductsWithoutBatches) {
		filteredProducts = filteredProducts.filter(p => p.batches.length > 0);
	}

	if (removeTreatedBatch) {
		const prodsWithNonThreatedBatches = filteredProducts.map(product => {
			const batches = product.batches.filter(
				batch => batch.status !== 'Tratado'
			);

			const prod: IProduct = {
				id: product.id,
				name: product.name,
				code: product.code,
				store: product.store,
				photo: product.photo,
				daysToBeNext: product.daysToBeNext,
				categories: product.categories,
				batches,
			};

			return prod;
		});

		filteredProducts = prodsWithNonThreatedBatches;
	}

	if (sortProductsByExpDate) {
		// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
		const resultsTemp = sortProductsLotesByLotesExpDate(filteredProducts);

		// DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
		// CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
		// DE QUAL ESTÁ MAIS PRÓXIMO
		const results = sortProductsByFisrtLoteExpDate(resultsTemp);

		filteredProducts = results;
	}

	if (limit) {
		filteredProducts = filteredProducts.slice(0, limit);
	}

	// This makes a copy of the products and return it without the realm reference
	// So we can use it in the react component and can be deleted without problems
	return filteredProducts.map(p => ({
		id: p.id,
		name: p.name,
		categories: p.categories,
		brand: p.brand,
		code: p.code,
		daysToBeNext: p.daysToBeNext,
		photo: p.photo,
		store: p.store,
		created_at: p.created_at,
		updated_at: p.updated_at,
		batches: p.batches.map(b => ({
			id: b.id,
			name: b.name || String(b.id),
			exp_date: b.exp_date,
			amount: b.amount,
			price: b.price,
			status: b.status,
			price_tmp: b.price_tmp,
			created_at: b.created_at,
			updated_at: b.updated_at,
		})),
	}));
}

interface searchForAProductInAListProps {
	products: Array<IProduct>;
	searchFor: string;
	limit?: number;
	sortByExpDate?: boolean;
}

export function searchForAProductInAList({
	products,
	searchFor,
	limit,
	sortByExpDate,
}: searchForAProductInAListProps): Array<IProduct> {
	const query = searchFor.trim().toLowerCase();

	const productsFind = products.filter(product => {
		const searchByName = product.name.toLowerCase().includes(query);

		if (searchByName) {
			return true;
		}

		if (product.code) {
			const searchBycode = product.code.toLowerCase().includes(query);

			if (searchBycode) {
				return true;
			}
		}

		if (product.store) {
			const searchByStore = product.store.toLowerCase().includes(query);

			if (searchByStore) {
				return true;
			}
		}

		if (product.batches.length > 0) {
			const lotesFounded = product.batches.filter(lote => {
				const searchByLoteName = lote.name
					.toLowerCase()
					.includes(query);

				if (searchByLoteName) {
					return true;
				}

				const slitedDate = query.split('/');

				if (slitedDate.length > 2) {
					const date = startOfDay(
						new Date(
							Number(slitedDate[2]),
							Number(slitedDate[1]) - 1,
							Number(slitedDate[0])
						)
					);

					if (compareAsc(startOfDay(lote.exp_date), date) === 0)
						return true;
				}

				return false;
			});

			if (lotesFounded.length > 0) {
				return true;
			}
		}

		return false;
	});

	if (sortByExpDate) {
		// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
		const resultsTemp = sortProductsLotesByLotesExpDate(productsFind);

		// DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
		// CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
		// DE QUAL ESTÁ MAIS PRÓXIMO
		const results = sortProductsByFisrtLoteExpDate(resultsTemp);

		if (limit) {
			const limitedResults = results.slice(0, limit);
			return limitedResults;
		}

		return results;
	}

	if (limit) {
		const limitedResults = productsFind.slice(0, limit);
		return limitedResults;
	}

	return productsFind;
}
