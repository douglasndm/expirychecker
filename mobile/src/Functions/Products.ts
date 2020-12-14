import Realm from '../Services/Realm';
import { sortLoteByExpDate, removeLotesTratados } from './Lotes';

// ESSA FUNÇÃO RECEBE UMA LISTA DE PRODUTOS E ORDERNAR CADA ARRAY DE LOTES DE CADA PRODUTO
// POR DATA DE VENCIMENTO, OU SEJA CADA PRODUTO DA LISTA VAI TER UM ARRAY DE LOTE JÁ ORDERNADO POR DATA DE VENCIMENTO
export function sortProductsLotesByLotesExpDate(
    listProducts: Array<IProduct>
): Array<IProduct> {
    const productsLotesSorted = listProducts.map((prod) => {
        const prodLotesSorted = sortLoteByExpDate(prod.lotes);

        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            store: prod.store,
            lotes: prodLotesSorted,
        };
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
    const results = listProducts.map((prod) => {
        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            store: prod.store,
            lotes: removeLotesTratados(prod.lotes),
        };
    });

    return results;
}

interface getAllProductsProps {
    removeProductsWithoutBatches?: boolean;
    sortProductsByExpDate?: boolean;
    limit?: number;
}

export async function getAllProducts({
    removeProductsWithoutBatches,
    sortProductsByExpDate,
    limit,
}: getAllProductsProps): Promise<Array<IProduct>> {
    const realm = await Realm();

    try {
        const allProducts = realm.objects<IProduct>('Product').slice();

        if (removeProductsWithoutBatches && sortProductsByExpDate) {
            const productsWithBatches = allProducts.filter(
                (p) => p.lotes.length > 0
            );

            // ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
            const resultsTemp = sortProductsLotesByLotesExpDate(
                productsWithBatches
            );

            // DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
            // CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
            // DE QUAL ESTÁ MAIS PRÓXIMO
            const results = sortProductsByFisrtLoteExpDate(resultsTemp);

            if (limit) {
                const productsLimited = results.slice(0, limit);
                return productsLimited;
            }

            return results;
        }

        if (removeProductsWithoutBatches) {
            const prodWithBachesOnly = allProducts.filter(
                (p) => p.lotes.length > 0
            );

            if (limit) {
                const productsLimited = prodWithBachesOnly.slice(0, limit);
                return productsLimited;
            }

            return prodWithBachesOnly;
        }

        if (sortProductsByExpDate) {
            // ORDENA OS LOTES DE CADA PRODUTO POR ORDEM DE EXPIRAÇÃO
            const resultsTemp = sortProductsLotesByLotesExpDate(allProducts);

            // DEPOIS QUE RECEBE OS PRODUTOS COM OS LOTES ORDERNADOS ELE VAI COMPARAR
            // CADA PRODUTO EM SI PELO PRIMIEIRO LOTE PARA FAZER A CLASSIFICAÇÃO
            // DE QUAL ESTÁ MAIS PRÓXIMO
            const sortedProducts = sortProductsByFisrtLoteExpDate(resultsTemp);

            if (limit) {
                const productsLimited = sortedProducts.slice(0, limit);
                return productsLimited;
            }

            return sortedProducts;
        }

        if (limit) {
            const productsLimited = allProducts.slice(0, limit);
            return productsLimited;
        }

        return allProducts;
    } catch (err) {
        throw new Error(err);
    }
}

export async function GetAllProducts(): Promise<Array<IProduct>> {
    const realm = await Realm();

    try {
        const results = realm.objects<IProduct>('Product').slice();

        return results;
    } catch (err) {
        throw new Error(err);
    }
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

    const productsFind = products.filter((product) => {
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
            const lotesFounded = product.lotes.filter((lote) => {
                const searchByLoteName = lote.lote
                    .toLowerCase()
                    .includes(query);

                if (searchByLoteName) {
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