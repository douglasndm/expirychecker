interface IProduct {
    id?: number;
    name: string;
    code?: string;
    store?: string;
    batches: Array<IBatch>;
}
