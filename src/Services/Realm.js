import Realm from 'realm';

import { ProductSchema } from '../Schemas/ProductSchema';
import { LoteSchema } from '../Schemas/LoteSchema';
import SettingSchema from '../Schemas/SettingSchema';

export default () => {
    return Realm.open({
        schema: [ProductSchema, LoteSchema, SettingSchema],
        schemaVersion: 1,
    });
};
