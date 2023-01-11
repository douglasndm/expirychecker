import XLSX from 'xlsx';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '@expirychecker/Locales';

import { shareFile } from '@utils/Share';
import { getAllBrands } from '@expirychecker/Utils/Brands';

import { getAllProducts } from '@expirychecker/Functions/Products';
import { getStore } from '@expirychecker/Functions/Stores';
import { getAllCategories } from '@expirychecker/Functions/Category';

function sortProducts(products: Array<exportModel>): Array<exportModel> {
	const lotesSorted = products.sort((p1, p2) => {
		if (p1.batch.exp_date > p2.batch.exp_date) return 1;
		if (p1.batch.exp_date < p2.batch.exp_date) return -1;
		return 0;
	});

	return lotesSorted;
}

async function saveSheet(worksheet: XLSX.WorkSheet): Promise<void> {
	const workbook = XLSX.utils.book_new();

	XLSX.utils.book_append_sheet(
		workbook,
		worksheet,
		strings.Function_Excel_Workbook_Name
	);

	const wbout = XLSX.write(workbook, {
		type: 'base64',
		bookType: 'xlsx',
	});

	await shareFile({
		fileAsString: wbout,
		fileName: strings.Function_Excel_filename,
		fileExtesion: 'xlsx',
		encoding: 'base64',
	});
}

export async function generateEmptyExcel(): Promise<void> {
	const excelRows: Array<ExcelRowProps> = [];

	const row: any = {};

	row[strings.Function_Excel_ColumnName_ProductName] = '';
	row[strings.Function_Excel_ColumnName_ProductCode] = '';
	row[strings.Function_Excel_ColumnName_ProductBrand] = '';
	row[strings.Function_Excel_ColumnName_ProductCategory] = '';
	row[strings.Function_Excel_ColumnName_ProductStore] = '';
	row[strings.Function_Excel_ColumnName_BatchName] = '';
	row[strings.Function_Excel_ColumnName_BatchPrice] = '';
	row[strings.Function_Excel_ColumnName_BatchAmount] = '';
	row[strings.Function_Excel_ColumnName_BatchExpDate] = '';
	row[strings.Function_Excel_ColumnName_Status] = '';

	excelRows.push(row);

	const worksheet = XLSX.utils.json_to_sheet(excelRows);

	await saveSheet(worksheet);
}

export async function exportToExcel({
	sortBy,
	category,
	brand,
	store,
}: exportProps): Promise<void> {
	let dateFormat = 'dd/MM/yyyy';

	if (getLocales()[0].languageCode === 'en') {
		dateFormat = 'MM/dd/yyyy';
	}

	const excelExport: Array<exportModel> = [];

	const allProducts = await getAllProducts({});

	allProducts.forEach(p => {
		p.batches.forEach(l => {
			excelExport.push({
				product: p,
				batch: l,
			});
		});
	});

	let sortedProducts;

	if (sortBy === 'expire_date') {
		sortedProducts = sortProducts(excelExport);
	} else {
		sortedProducts = excelExport;
	}

	if (category && category !== 'null') {
		sortedProducts = sortedProducts.filter(prod => {
			const findedCate = prod.product.categories.filter(
				c => c === category
			);

			if (findedCate.length > 0) {
				return true;
			}
			return false;
		});
	}

	if (brand && brand !== 'null') {
		sortedProducts = sortedProducts.filter(prod => {
			if (prod.product.brand === brand) {
				return true;
			}
			return false;
		});
	}

	if (store && store !== 'null') {
		sortedProducts = sortedProducts.filter(prod => {
			if (prod.product.store === store) {
				return true;
			}
			return false;
		});
	}

	const allBrands = await getAllBrands();
	const allCategories = await getAllCategories();

	const excelRows: Array<ExcelRowProps> = [];

	for await (const item of sortedProducts) {
		const findedStore = await getStore(item.product.store || '');

		const findedBrand = allBrands.find(b => b.id === item.product.brand);
		const findedCategory = allCategories.find(
			cat => cat.id === item.product.categories[0]
		);

		const row: any = {};

		row[strings.Function_Excel_ColumnName_ProductName] = item.product.name;
		row[strings.Function_Excel_ColumnName_ProductCode] =
			item.product.code || '';
		row[strings.Function_Excel_ColumnName_ProductBrand] =
			findedBrand?.name || '';
		row[strings.Function_Excel_ColumnName_ProductCategory] =
			findedCategory?.name || '';
		row[strings.Function_Excel_ColumnName_ProductStore] = findedStore?.name;
		row[strings.Function_Excel_ColumnName_BatchName] = item.batch.name;
		row[strings.Function_Excel_ColumnName_BatchPrice] =
			item.batch.price || 0;
		row[strings.Function_Excel_ColumnName_BatchAmount] =
			item.batch.amount || 0;
		row[strings.Function_Excel_ColumnName_BatchExpDate] = format(
			item.batch.exp_date,
			dateFormat
		);
		row[strings.Function_Excel_ColumnName_Status] =
			item.batch.status === 'Tratado'
				? strings.Function_Excel_ColumnName_Status_Checked
				: strings.Function_Excel_ColumnName_Status_Unchecked;

		excelRows.push(row);
	}

	const worksheet = XLSX.utils.json_to_sheet(excelRows);

	await saveSheet(worksheet);
}
