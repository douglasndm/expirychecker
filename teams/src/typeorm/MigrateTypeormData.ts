import 'reflect-metadata';
import { createConnection, getRepository } from 'typeorm';
import { createProduct } from '../Functions/Product';

import { Batch } from './Models/Batch';
import { Product } from './Models/Product';

export async function migrateAllDataFromSQLiteToRealm(): Promise<void> {
    const connection = await createConnection({
        type: 'react-native',
        database: 'controledevalidadedatabase',
        location: 'default',
        entities: [Product, Batch],
    });

    try {
        const productRepository = getRepository(Product);
        const products = await productRepository.find();

        const newProducts: Array<IProduct> = products.map((p) => {
            const lotes: Array<ILote> = p.batches.map((b) => ({
                lote: b.name,
                exp_date: b.exp_date,
                amount: b.amount,
                price: b.price,
                status: b.status,
            }));

            return {
                name: p.name,
                code: p.code,
                store: p.store,
                lotes,
            };
        });

        for (const product of newProducts) { // eslint-disable-line
            await createProduct({ product, ignoreDuplicate: true });
        }
    } catch (error) {
        throw new Error(error);
    } finally {
        await connection.close();
    }
}
