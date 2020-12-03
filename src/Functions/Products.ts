import { IsNull } from 'typeorm';
import { getConnection } from '../Services/TypeORM';

import { Product } from '../Models/Product';

import { removeAllTreatedBatches, sortByBatchExpDate } from './Batches';

export async function getAllProducts(): Promise<Array<Product>> {
    const connection = await getConnection();

    try {
        const productRepository = connection.getRepository(Product);

        const products = await productRepository.find();

        return products;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function getAllProductsWithBatches(): Promise<Array<Product>> {
    const products = await getAllProducts();

    const filtedredProducts = products.filter(
        (prod) => prod.batches.length > 0
    );

    return filtedredProducts;
}

export async function getAllProductsWithoutStore(): Promise<Array<Product>> {
    const connection = await getConnection();

    try {
        const productRepository = connection.getRepository(Product);

        const results = await productRepository.find({
            where: {
                store: IsNull(),
            },
        });

        return results;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}
// ESSA FUNÇÃO RECEBE UMA LISTA DE PRODUTOS E ORDERNAR CADA ARRAY DE LOTES DE CADA PRODUTO
// POR DATA DE VENCIMENTO, OU SEJA CADA PRODUTO DA LISTA VAI TER UM ARRAY DE LOTE JÁ ORDERNADO POR DATA DE VENCIMENTO
export function sortProductsBatchesByBatchExpDate(
    products: Array<Product>
): Array<IProduct> {
    const sortedProducts = products.map((prod) => {
        const sortedBatches = sortByBatchExpDate(prod.batches);

        return {
            ...prod,
            batches: sortedBatches,
        };
    });

    return sortedProducts;
}

// classifica os produtos em geral pelo o mais proximo de vencer
// ATENÇÃO QUE A FUNÇÃO SÓ PEGA O PRIMEIRO VALOR DO ARRAY DE LOTES, OU SEJA
// É ESPERADO QUE O ARRAY DE LOTES JÁ TENHA SIDO ORDERNADO ANTES
export function sortProductsByFirstBatchExpDate(
    products: Array<Product>
): Array<Product> {
    const sortedProducts = products.sort((prod1, prod2) => {
        if (prod1.batches !== null && prod1.batches.length > 0) {
            if (prod2.batches !== null && prod2.batches.length > 0) {
                if (prod1.batches[0].exp_date > prod2.batches[0].exp_date)
                    return 1;
                if (prod1.batches[0].exp_date < prod2.batches[0].exp_date)
                    return -1;
                return 0;
            }
            return 1;
        }

        return -1;
    });

    return sortedProducts;
}

export function removeAllTreatedBatchesFromAllProducts(
    products: Array<IProduct>
): Array<IProduct> {
    const results = products.map((prod) => {
        return {
            ...prod,
            batches: removeAllTreatedBatches(prod.batches),
        };
    });

    return results;
}
