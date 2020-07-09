import Realm from 'realm';

import { ProductSchema } from '../Schemas/ProductSchema';
import { LoteSchema } from '../Schemas/LoteSchema';

export default () => {
    return Realm.open({
        schema: [ProductSchema, LoteSchema],
        schemaVersion: 1,
    });
};
