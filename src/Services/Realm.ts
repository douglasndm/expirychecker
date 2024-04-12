import Realm from 'realm';

import ProductSchema from '@expirychecker/Schemas/Product';
import BatchSchema from '@expirychecker/Schemas/Batch';
import CategorySchema from '@expirychecker/Schemas/Category';
import StoreSchema from '@expirychecker/Schemas/Store';
import BrandSchema from '@expirychecker/Schemas/Brand';

const RealmInstance = new Realm({
	schema: [
		ProductSchema,
		BatchSchema,
		CategorySchema,
		StoreSchema,
		BrandSchema,
	],
	schemaVersion: 13,
});

export default RealmInstance;
