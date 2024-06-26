import Realm from '@expirychecker/Services/Realm';

import {
	sortProductsByFisrtLoteExpDate,
	sortProductsLotesByLotesExpDate,
} from '@expirychecker/Functions/Products';

import {
	removeProductsWithoutBatchesFromList,
	removeTreatedBatchesFromList,
} from './Helpers';
import { getAllCategories } from '../Categories/All';
import { getAllBrands } from '../Brands/All';
import { getAllStores } from '../Stores/Find';

interface getAllProductsProps {
	removeProductsWithoutBatches?: boolean;
	removeTreatedBatch?: boolean;
	sortProductsByExpDate?: boolean;
	limit?: number;
}

// Get all products asynchronically
async function getAllProductsAsync({
	removeProductsWithoutBatches,
	removeTreatedBatch,
	sortProductsByExpDate,
	limit,
}: getAllProductsProps): Promise<Array<IProduct>> {
	const allBrands = await getAllBrands();
	const allCategories = await getAllCategories();
	const allStores = await getAllStores();

	return new Promise((resolve, reject) => {
		try {
			let filteredProducts = [...Realm.objects<IProduct>('Product')];

			if (removeProductsWithoutBatches) {
				filteredProducts =
					removeProductsWithoutBatchesFromList(filteredProducts);
			}

			if (removeTreatedBatch) {
				filteredProducts =
					removeTreatedBatchesFromList(filteredProducts);
			}

			if (sortProductsByExpDate) {
				// ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
				const resultsTemp =
					sortProductsLotesByLotesExpDate(filteredProducts);

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
			const copiedProds: IProduct[] = filteredProducts.map(p => {
				let brand: IBrand | undefined;
				let category: ICategory | undefined;
				let store: IStore | undefined;

				if (p.categories && p.categories.length > 0) {
					const cat = allCategories.find(
						c => c.id === p.categories[0]
					);
					category = cat;
				}

				if (p.brand) {
					brand = allBrands.find(b => b.id === String(p.brand));
				}

				if (p.store) {
					store = allStores.find(s => s.id === String(p.store));
				}

				return {
					id: p.id,
					name: p.name,
					category,
					brand,
					code: p.code,
					daysToBeNext: p.daysToBeNext,
					photo: p.photo,
					store,
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
				};
			});

			resolve(copiedProds);
		} catch (error) {
			reject(error);
		}
	});
}

export { getAllProductsAsync };
