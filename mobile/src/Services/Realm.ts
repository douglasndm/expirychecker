import Realm from 'realm';

import ProductSchema from '../Schemas/ProductSchema';
import LoteSchema from '../Schemas/LoteSchema';
import SettingSchema from '../Schemas/SettingSchema';

const RealmInstance = new Realm({
    schema: [ProductSchema, LoteSchema, SettingSchema],
    schemaVersion: 3,
});

export default RealmInstance;
