import Realm from 'realm';

import ProductSchema from '~/Schemas/ProductSchema';
import LoteSchema from '~/Schemas/LoteSchema';
import CategorySchema from '~/Schemas/Category';
import StoreSchema from '~/Schemas/Store';
import BrandSchema from '~/Schemas/Brand';

const RealmInstance = new Realm({
    schema: [
        ProductSchema,
        LoteSchema,
        CategorySchema,
        StoreSchema,
        BrandSchema,
    ],
    schemaVersion: 10,
});

export default RealmInstance;
