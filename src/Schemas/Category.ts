const CategorySchema: Realm.ObjectSchema = {
	name: 'Category',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', indexed: true },
		name: 'string',

		created_at: { type: 'date?', default: new Date(), mapTo: 'created_at' },
		updated_at: { type: 'date?', default: new Date(), mapTo: 'updated_at' },
	},
};

export default CategorySchema;
