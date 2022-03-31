type RoutesParams = {
    Home;
    AddProduct: {
        brand?: string;
        category?: string;
        code?: string;
        store?: string;
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
        productId: number;
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
        productId: number;
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
    BrandEdit: {
        brand_id: string;
    };

    Export;
    Teams;
    Test;

    TrackingPermission;
};
