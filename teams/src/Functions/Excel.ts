import XLSX from 'xlsx';

import { shareFile } from './Share';
import { GetAllProducts } from './Products';

interface ExcelRowProps {
    produto: string;
    codigo: string;
    loja: string;
    lote: string;
    vencimento: Date;
    quantidade: number;
    preço: number;
}

export async function exportToExcel(): Promise<void> {
    try {
        const workbook = XLSX.utils.book_new();

        const products = await GetAllProducts();

        const excelRows: Array<ExcelRowProps> = [];

        products.forEach((product) => {
            product.lotes.forEach((batch) => {
                excelRows.push({
                    produto: product.name,
                    codigo: product.code || '',
                    loja: product.store || '',
                    lote: batch.lote,
                    preço: batch.price || 0,
                    quantidade: batch.amount || 0,
                    vencimento: batch.exp_date,
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(excelRows);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Controle de validade'
        );

        const wbout = XLSX.write(workbook, {
            type: 'base64',
            bookType: 'xlsx',
        });

        await shareFile({
            fileAsString: wbout,
            fileName: 'controledevalidade',
            fileExtesion: 'xlsx',
            encoding: 'base64',
        });
    } catch (err) {
        throw new Error(err);
    }
}
