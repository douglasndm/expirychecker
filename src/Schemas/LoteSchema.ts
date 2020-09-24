const LoteSchema = {
    name: 'Lote',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', indexed: true },
        lote: 'string',
        exp_date: 'date',
        amount: 'int?',
        status: 'string?',
    },
};

export default LoteSchema;
