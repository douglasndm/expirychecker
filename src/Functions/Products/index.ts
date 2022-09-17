import { compareAsc, startOfDay } from 'date-fns';

import realm from '~/Services/Realm';

import { removeLotesTratados } from '../Lotes';
import { sortBatches } from '~/Utils/Batches/Sort';

export async function saveMany(
    products: Omit<IProduct, 'id'>[]
): Promise<void> {
    const lastProd = realm.objects<IProduct>('Product').sorted('id', true)[0];
    let nextProdId = lastProd == null ? 1 : lastProd.id + 1;

    realm.write(() => {
        products.forEach(prod => {
            const lastLote = realm.objects<ILote>('Lote').sorted('id', true)[0];
            let lastLoteId = lastLote == null ? 0 : lastLote.id;

            const batches = prod.lotes.map(batch => {
                lastLoteId += 1;

                const batchName =
                    batch.lote !== 'undefined'
                        ? batch.lote
                        : String(lastLoteId);

                return {
                    ...batch,
                    id: lastLoteId,
                    lote: batchName,
                };
            });
            const product: IProduct = {
                ...prod,
                id: nextProdId,
                lotes: batches,
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
        const prodLotesSorted = sortBatches(prod.lotes);

        const product: IProduct = {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            store: prod.store,
            photo: prod.photo,
            categories: prod.categories,
            daysToBeNext: prod.daysToBeNext,
            lotes: prodLotesSorted,
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
        if (item1.lotes.length === 0 && item2.lotes.length > 0) {
            return 1;
        }
        if (item1.lotes.length > 0 && item2.lotes.length === 0) {
            return -1;
        }

        if (item1.lotes !== null && item1.lotes.length > 0) {
            if (item2.lotes !== null && item2.lotes.length > 0) {
                if (item1.lotes[0].exp_date > item2.lotes[0].exp_date) return 1;
                if (item1.lotes[0].exp_date < item2.lotes[0].exp_date)
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
            lotes: removeLotesTratados(prod.lotes),
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

export async function getAllProducts({
    removeProductsWithoutBatches = false,
    removeTreatedBatch = false,
    sortProductsByExpDate = false,
    limit,
}: getAllProductsProps): Promise<Array<IProduct>> {
    const allProducts = realm.objects<IProduct>('Product').slice();

    let filtertedProducts: Array<IProduct> = allProducts;

    if (removeProductsWithoutBatches) {
        const prodWithBachesOnly = filtertedProducts.filter(
            p => p.lotes.length > 0
        );

        filtertedProducts = prodWithBachesOnly;
    }

    if (removeTreatedBatch) {
        const prodsWithNonThreatedBatches = filtertedProducts.map(product => {
            const batches = product.lotes.filter(
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
                lotes: batches,
            };

            return prod;
        });

        filtertedProducts = prodsWithNonThreatedBatches;
    }

    if (sortProductsByExpDate) {
        // ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
        const resultsTemp = sortProductsLotesByLotesExpDate(filtertedProducts);

        // DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
        // CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
        // DE QUAL ESTÁ MAIS PRÓXIMO
        const results = sortProductsByFisrtLoteExpDate(resultsTemp);

        filtertedProducts = results;
    }

    if (limit) {
        const productsLimited = filtertedProducts.slice(0, limit);
        filtertedProducts = productsLimited;
    }

    return filtertedProducts;
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

        if (product.lotes.length > 0) {
            const lotesFounded = product.lotes.filter(lote => {
                const searchByLoteName = lote.lote
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
