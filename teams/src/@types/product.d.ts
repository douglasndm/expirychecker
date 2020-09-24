interface IProduct {
    id: number;
    name: string;
    code?: string;
    store?: string;
    lotes: Array<ILote>;
}
