const CategorySchema: Realm.ObjectSchema = {
	name: 'Category',
	primaryKey: '_id',
	properties: {
		_id: { type: 'string', indexed: true },
		id: { type: 'string', indexed: true },
		name: 'string',
	},
};

export default CategorySchema;
