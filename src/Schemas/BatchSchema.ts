const BatchSchema: Realm.ObjectSchema = {
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

		created_at: { type: 'date?', default: new Date(), mapTo: 'createdAt' },
		updated_at: { type: 'date?', default: new Date(), mapTo: 'updateddAt' },
	},
};

export default BatchSchema;
