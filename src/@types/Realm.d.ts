interface ICategory {
	id: string;
	name: string;

	created_at?: Date;
	updated_at?: Date;
}

interface IBrand {
	id: string;
	name: string;

	created_at?: Date;
	updated_at?: Date;
}

interface IStore {
	id: string;
	name: string;

	created_at?: Date;
	updated_at?: Date;
}

interface IBatch {
	id: number;
	name: string;
	exp_date: Date;
	amount?: number;
	price?: number;
	status?: string;
	price_tmp?: number;

	where_is?: 'stock' | 'shelf' | null;
	additional_data?: string | null;

	created_at?: Date;
	updated_at?: Date;
}

interface IProduct {
	id: number;
	name: string;
	code?: string;
	photo?: string;
	daysToBeNext?: number;

	category?: ICategory;
	brand?: IBrand;
	store?: IStore;

	batches: Array<IBatch>;

	created_at?: Date;
	updated_at?: Date;
}
