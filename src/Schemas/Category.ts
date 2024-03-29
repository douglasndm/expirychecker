const CategorySchema: Realm.ObjectSchema = {
	name: 'Category',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', indexed: true },
		name: 'string',
	},
};

export default CategorySchema;
