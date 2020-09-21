type IAppRoute = {
    Home: React.FC;
    AddProduct: React.FC;
    AddLote: { productId: number };
    AllProducts: React.FC;
    Settings: React.FC;
    About: React.FC;
    ProductDetails: { productId: number };
    EditProduct: { productId: number };
    EditLote: { productId: number; loteId: number };
    Test: React.FC;
    PremiumSubscription: React.FC;
};
