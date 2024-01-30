type RoutesParams = {
	Home;
	AddProduct: {
		brand?: string;
		category?: string;
		code?: string;
		store?: string;
	};
	About;
	ProductDetails: {
		id: number;
	};
	StoreDetails: {
		store: string;
	};
	AddBatch: {
		productId: number | string;
	};
	EditProduct: {
		productId: number;
	};
	EditLote: {
		productId: number;
		loteId: number;
	};
	BatchView: {
		product_id: number;
		batch_id: number;
	};
	BatchDiscount: {
		batch_id: number;
	};
	Success: {
		type:
			| 'create_batch'
			| 'create_product'
			| 'edit_batch'
			| 'edit_product'
			| 'delete_batch'
			| 'delete_product';
		productId?: number;

		category_id?: string;
		store_id?: string;
	};
	Error;
	PhotoView: {
		productId: number;
	};
	ListCategory;
	CategoryView: {
		id: string;
	};
	CategoryEdit: {
		id: string;
	};

	StoreList;
	StoreEdit: {
		store_id: string;
	};

	BrandList;
	BrandView: {
		brand_id: string;
	};
	BrandEdit: {
		brand_id: string;
	};

	Export;
	Teams;
	SubscriptionCancel;

	Settings;
	DeleteAll;

	Login;

	TrackingPermission;

	Test;
};
