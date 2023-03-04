const StoreSchema: Realm.ObjectSchema = {
	name: 'Store',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', indexed: true },
		name: 'string',
	},
};

export default StoreSchema;
