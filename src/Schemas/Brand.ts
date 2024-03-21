const BrandSchema: Realm.ObjectSchema = {
	name: 'Brand',
	primaryKey: '_id',
	properties: {
		_id: { type: 'string', indexed: true },
		id: { type: 'string', indexed: true },
		name: 'string',
	},
};

export default BrandSchema;
