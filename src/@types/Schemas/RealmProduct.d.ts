interface RealmProduct {
	id: number;
	name: string;
	code?: string;
	brand?: string;
	photo?: string;
	daysToBeNext?: number;
	store?: string; // store uuid
	categories: ICategory[]; // uuid
	batches: IBatch[];

	// optional is true because of old version of schema when it was not required
	created_at?: Date;
	updated_at?: Date;
}
