import Realm from 'realm';

import ProductSchema from '~/Schemas/ProductSchema';
import LoteSchema from '~/Schemas/LoteSchema';
import CategorySchema from '~/Schemas/Category';
import StoreSchema from '~/Schemas/Store';
import BrandSchema from '~/Schemas/Brand';

export default async function RealmInstance(): Promise<Realm> {
    const realm = await Realm.open({
        schema: [
            ProductSchema,
            LoteSchema,
            CategorySchema,
            StoreSchema,
            BrandSchema,
        ],
        schemaVersion: 9,
    });

    return realm;
}
