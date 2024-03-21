interface ICategory {
	_id: string;
	id: string;
	name: string;
}

interface IBrand {
	_id: string;
	id: string;
	name: string;
}

interface IStore {
	_id: string;
	id: string;
	name: string;
}

interface IBatch {
	_id: string;
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
	_id: string;
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
