import { createConnection } from 'typeorm';

import { Product } from '../Models/Product';

createConnection({
    type: 'react-native',
    database: 'controledevalidadedatabase',
    location: 'default',
    entities: [Product],
    synchronize: true,
})
    .then(() => {
        console.log('Connection with sqlite was successful');
    })
    .catch((err) => {
        console.log(`erro connection with db ${err}`);
    });
