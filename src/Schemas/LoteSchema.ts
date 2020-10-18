const LoteSchema = {
    name: 'Lote',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        lote: 'string',
        exp_date: 'date',
        amount: 'int?',
        price: 'float?',
        status: 'string?',
    },
};

export default LoteSchema;
