import { Connection, createConnection } from 'typeorm';

import { Product } from '../Models/Product';
import { Batch } from '../Models/Batch';
import { Setting } from '../Models/Setting';

export async function getConnection(): Promise<Connection> {
    return createConnection({
        type: 'react-native',
        database: 'controledevalidadedatabase',
        location: 'default',
        entities: [Product, Batch, Setting],
        synchronize: true,
    });
}