const SettingSchema = {
    name: 'Setting',
    primaryKey: 'name',
    properties: {
        name: { type: 'string', indexed: true },
        value: 'string?', // ? no final diz ao Realm que o campo pode ficar vazio
    },
};

export default SettingSchema;
