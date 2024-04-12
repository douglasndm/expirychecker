import { ObjectSchema } from 'realm';

const BatchSchema: ObjectSchema = {
	name: 'Lote',
	primaryKey: 'id',
	properties: {
		id: { type: 'int', indexed: true },
		name: { type: 'string', mapTo: 'lote' },
		exp_date: 'date',
		amount: 'int?',
		price: 'float?',
		status: 'string?',
		price_tmp: 'float?',

		where_is: { type: 'string', optional: true, mapTo: 'where_is' },
		additional_data: {
			type: 'string',
			optional: true,
			mapTo: 'additional_data',
		},

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

export default BatchSchema;
