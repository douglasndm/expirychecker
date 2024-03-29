const ProductSchema: Realm.ObjectSchema = {
	name: 'Product',
	primaryKey: 'id',
	properties: {
		id: { type: 'int', indexed: true },
		name: 'string',
		code: 'string?', // ? no final diz ao Realm que o campo pode ficar vazio
		brand: 'string?',
		photo: 'string?',
		daysToBeNext: 'int?',
		store: 'string?',
		categories: 'string[]', // uuid
		batches: { type: 'Lote[]', mapTo: 'lotes' },

		created_at: { type: 'date?', default: new Date(), mapTo: 'created_at' },
		updated_at: { type: 'date?', default: new Date(), mapTo: 'updated_at' },
	},
};

export default ProductSchema;
