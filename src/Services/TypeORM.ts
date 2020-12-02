import { Connection, createConnection } from 'typeorm';

import { Product } from '../Models/Product';
import { Batch } from '../Models/Batch';

export async function getConnection(): Promise<Connection> {
    try {
        return createConnection({
            type: 'react-native',
            database: 'controledevalidadedatabase',
            location: 'default',
            entities: [Product, Batch],
            synchronize: __DEV__,
        });
    } catch (err) {
        throw new Error(err);
    }
}
