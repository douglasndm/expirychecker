import { ObjectSchema } from 'realm';

const ProductSchema: ObjectSchema = {
	name: 'Product',
	primaryKey: 'id',
	properties: {
		id: { type: 'int', indexed: true },
		name: 'string',
		code: 'string?', // ? no final diz ao Realm que o campo pode ficar vazio
		brand: 'string?', // brand uuid
		photo: 'string?',
		daysToBeNext: 'int?',
		store: 'string?', // store uuid
		categories: 'string[]', // uuid
		batches: { type: 'list', objectType: 'Lote', mapTo: 'lotes' },

		// optional is true because of old version of schema when it was not required
		created_at: {
			type: 'date',
			optional: true,
			default: new Date(),
			mapTo: 'created_at',
		},
		updated_at: {
			type: 'date',
			optional: true,
			default: new Date(),
			mapTo: 'updated_at',
		},
	},
};

export default ProductSchema;
