interface IProduct {
    id: number;
    name: string;
    code?: string;
    lotes: Array<ILote>;
}
