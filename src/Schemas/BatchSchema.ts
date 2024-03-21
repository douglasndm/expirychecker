const BatchSchema: Realm.ObjectSchema = {
	name: 'Lote',
	primaryKey: '_id',
	properties: {
		_id: { type: 'string', indexed: true },
		id: { type: 'int', indexed: true },
		name: { type: 'string', mapTo: 'lote' },
		exp_date: 'date',
		amount: 'int?',
		price: 'float?',
		status: 'string?',
		price_tmp: 'float?',

		where_is: { type: 'string?', mapTo: 'where_is' },
		additional_data: { type: 'string?', mapTo: 'additional_data' },

		created_at: { type: 'date?', default: new Date(), mapTo: 'created_at' },
		updated_at: { type: 'date?', default: new Date(), mapTo: 'updated_at' },
	},
};

export default BatchSchema;
