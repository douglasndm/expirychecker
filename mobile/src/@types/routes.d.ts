type IAppRoute = {
    Home: React.FC;
    AddProduct: React.FC;
    AddLote: { productId: number };
    AllProducts: React.FC;
    AllProductsByStore: React.FC;
    Settings: React.FC;
    About: React.FC;
    ProductDetails: { productId: number };
    EditProduct: { productId: number };
    EditLote: { product: IProduct; loteId: number };
    Test: React.FC;
    PremiumSubscription: React.FC;
};
