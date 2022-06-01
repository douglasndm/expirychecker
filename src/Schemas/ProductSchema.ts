const ProductSchema = {
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
        lotes: 'Lote[]',

        createdAt: { type: 'date?', default: new Date() },
        updateddAt: { type: 'date?', default: new Date() },
    },
};

export default ProductSchema;
