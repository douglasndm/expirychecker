interface IBatch {
	id: number;
	name: string;
	exp_date: Date;
	amount?: number;
	price?: number;
	status?: string;
	price_tmp?: number;

	created_at?: Date;
	updated_at?: Date;
}

interface IProduct {
	id: number;
	name: string;
	code?: string;
	brand?: string;
	store?: string;
	photo?: string;
	daysToBeNext?: number;
	categories: Array<string>;
	batches: Array<IBatch>;

	created_at?: Date;
	updated_at?: Date;
}

interface ICategory {
	id: string;
	name: string;
}

interface IBrand {
	id: string;
	name: string;
}

interface IStore {
	id: string;
	name: string;
}
