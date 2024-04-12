import { ObjectSchema } from 'realm';

const BrandSchema: ObjectSchema = {
	name: 'Brand',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', indexed: true },
		name: 'string',

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

export default BrandSchema;
