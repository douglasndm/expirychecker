import Realm from 'realm';

import ProductSchema from '@expirychecker/Schemas/ProductSchema';
import BatchSchema from '@expirychecker/Schemas/BatchSchema';
import CategorySchema from '@expirychecker/Schemas/Category';
import StoreSchema from '@expirychecker/Schemas/Store';
import BrandSchema from '@expirychecker/Schemas/Brand';

import Migration from '@expirychecker/Schemas/Migrations/01';

const RealmInstance = new Realm({
	schema: [
		ProductSchema,
		BatchSchema,
		CategorySchema,
		StoreSchema,
		BrandSchema,
	],
	schemaVersion: 13,
	onMigration: Migration.migrate,
});

export default RealmInstance;
