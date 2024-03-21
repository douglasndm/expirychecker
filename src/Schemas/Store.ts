const StoreSchema: Realm.ObjectSchema = {
	name: 'Store',
	primaryKey: '_id',
	properties: {
		_id: { type: 'string', indexed: true },
		id: { type: 'string', indexed: true },
		name: 'string',
	},
};

export default StoreSchema;
