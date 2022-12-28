const LoteSchema: Realm.ObjectSchema = {
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

		createdAt: { type: 'date?', default: new Date() },
		updateddAt: { type: 'date?', default: new Date() },
	},
};

export default LoteSchema;
