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

export async function GetAllProducts(): Promise<Array<IProduct>> {
    try {
        const results = Realm.objects<IProduct>('Product').slice();

        return results;
    } catch (err) {
        throw new Error(err);
    }
}

export async function GetAllProductsWithLotes(): Promise<Array<IProduct>> {
    try {
        const results = Realm.objects<IProduct>('Product')
            .filtered('lotes.@count > 0')
            .slice();

        return results;
    } catch (err) {
        console.warn(err);
    }

    return [];
}

export async function GetAllProductsByStore(
    store: string
): Promise<Array<IProduct>> {
    try {
        const results = Realm.objects<IProduct>('Product')
            .filtered(`store = '${store}'`)
            .slice();

        return results;
    } catch (err) {
        throw new Error(err);
    }
}

export async function GetAllProductsWithoutStore(): Promise<Array<IProduct>> {
    try {
        const results = Realm.objects<IProduct>('Product')
            .filtered(`store == null OR store == ''`)
            .slice();

        return results;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getAllStores(): Promise<Array<string>> {
    try {
        const stores: Array<string> = [];

        const results = Realm.objects<IProduct>('Product').sorted('store');

        results.forEach((product) => {
            if (product.store) {
                const temp = stores.find((store) => store === product.store);

                if (!temp) {
                    stores.push(product.store);
                }
            }
        });

        return stores;
    } catch (err) {
        throw new Error(err);
    }
}
