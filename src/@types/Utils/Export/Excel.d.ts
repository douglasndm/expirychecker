interface ExcelRowProps {
	produto: string;
	codigo: string;
	loja: string;
	lote: string;
	vencimento: Date;
	quantidade: number;
	preço: number;
}

interface exportModel {
	product: Omit<IProduct, 'Lotes'>;
	batch: IBatch;
}

interface exportProps {
	category?: string | null;
	brand?: string | null;
	store?: string | null;
}

interface IExcelProduct extends IProduct {
	lotes: Omit<IBatch, 'id'>[];
}
