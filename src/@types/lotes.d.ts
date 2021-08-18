interface ILote {
    id: number;
    lote: string;
    exp_date: Date;
    amount?: number;
    price?: number;
    status?: string;
    price_tmp?: number;
}
