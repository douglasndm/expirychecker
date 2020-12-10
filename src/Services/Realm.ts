import Realm from 'realm';

import ProductSchema from '../Schemas/ProductSchema';
import LoteSchema from '../Schemas/LoteSchema';
import SettingSchema from '../Schemas/SettingSchema';

export default async function RealmInstance(): Promise<Realm> {
    const realm = await Realm.open({
        schema: [ProductSchema, LoteSchema, SettingSchema],
        schemaVersion: 3,
    });

    return realm;
}
