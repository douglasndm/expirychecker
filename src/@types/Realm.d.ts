interface IProduct {
    id: number;
    name: string;
    code?: string;
    brand?: string;
    store?: string;
    photo?: string;
    daysToBeNext?: number;
    categories: Array<string>;
    lotes: Array<ILote>;

    createdAt?: Date;
    updatedAt?: Date;
}

interface ILote {
    id: number;
    lote: string;
    exp_date: Date;
    amount?: number;
    price?: number;
    status?: string;
    price_tmp?: number;

    createdAt?: Date;
    updatedAt?: Date;
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
