interface IProduct {
    id?: number;
    name: string;
    code?: string;
    store?: string;
    batches: Array<IBatch>;
}

interface IProductRealm {
    id?: number;
    name: string;
    code?: string;
    store?: string;
    lotes: Array<ILote>;
}
