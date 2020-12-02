import { IsNull, Not } from 'typeorm';
import { getConnection } from '../Services/TypeORM';

import { Product } from '../Models/Product';

interface getAllProductsByStoreProps {
    store: string;
    limit?: number;
}
export async function getAllProductsByStore({
    store,
    limit,
}: getAllProductsByStoreProps): Promise<Array<Product>> {
    const connection = await getConnection();

    try {
        const productRepository = connection.getRepository(Product);

        const products = await productRepository.find({
            where: {
                store,
            },
            take: limit,
        });

        return products;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function getAllStoresNames(): Promise<Array<string>> {
    const connection = await getConnection();

    try {
        const stores: Array<string> = [];

        const productRepository = connection.getRepository(Product);
        const results = await productRepository.find();

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
    } finally {
        await connection.close();
    }
}
