const BrandSchema = {
    name: 'Brand',
    primaryKey: 'id',
    properties: {
        id: { type: 'string', indexed: true },
        name: 'string',
    },
};

export default BrandSchema;
