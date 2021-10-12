type RoutesParams = {
    Home;
    AddProduct: {
        category?: string;
        category?: string;
    };
    AllProducts;
    WeekView;
    Settings;
    About;
    ProductDetails: {
        id: number;
    };
    StoreDetails: {
        store: string;
    };
    AddLote: {
        productId: number;
    };
    EditProduct: {
        product: number;
    };
    EditLote: {
        productId: number;
        batchId: number;
    };
    BatchView: {
        product: string;
        batch_id: number;
    };
    BatchDiscount: {
        batch_id: number;
    };
    Pro;
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
        productId: string;
    };
    ListCategory;
    CategoryView: {
        category_id: string;
        category_name?: string;
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

    NotificationsPreferences;
    Export;
    Teams;
    Test;

    TrackingPermission;
};
