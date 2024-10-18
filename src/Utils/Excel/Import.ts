import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { parseISO } from 'date-fns';

import strings from '@expirychecker/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { createBrand } from '@expirychecker/Utils/Brands/Create';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { createCategory } from '@expirychecker/Utils/Categories/Create';

import { saveMany } from '@expirychecker/Functions/Products/index';
import { createStore } from '@expirychecker/Functions/Stores';

// This is necessary because Excel exports use different languages, so depends of the user settings
// This also makes only be possible to import and excel file of the same language
const localizedName = strings.Function_Excel_ColumnName_ProductName;
const localizedCode = strings.Function_Excel_ColumnName_ProductCode;
const localizedBName = strings.Function_Excel_ColumnName_BatchName;
const localizedBExp = strings.Function_Excel_ColumnName_BatchExpDate;
const localizedBAmount = strings.Function_Excel_ColumnName_BatchAmount;
const localizedBPrice = strings.Function_Excel_ColumnName_BatchPrice;
const localizedBStatus = strings.Function_Excel_ColumnName_Status;
const localizedBrandName = strings.Function_Excel_ColumnName_ProductBrand;
const localizedCategoryName = strings.Function_Excel_ColumnName_ProductCategory;
const localizedStoreName = strings.Function_Excel_ColumnName_ProductStore;

interface findProductIndexProps {
	products: Omit<IExcelProduct, 'id'>[];
	product: Omit<IExcelProduct, 'id'>;
}

function findProductIndex({
	products,
	product,
}: findProductIndexProps): number {
	return products.findIndex(p => {
		if (p.code && product.code) {
			if (p.code === product.code) {
				return true;
			}
			return false;
		}
		if (product.name) {
			if (p.name === product.name) {
				return true;
			}
			return false;
		}

		return false;
	});
}

async function importExcel(): Promise<void> {
	const file = await DocumentPicker.pickSingle({
		copyTo: 'documentDirectory',
		type: DocumentPicker.types.xlsx,
		mode: 'open',
	});

	if (!file.name) {
		throw new Error('File does not have a name');
	}

	// Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
	const [, extension] = file.name.split('.');

	// caso a extensão do arquivo não for cvbf lança um erro e sai da função
	if (extension !== 'xlsx') {
		captureException(
			new Error(strings.Function_Import_Error_InvalidExtesion),
			{
				extra: {
					file,
				},
			}
		);
		throw new Error(strings.Function_Import_Error_InvalidExtesion);
	}

	if (!file.fileCopyUri) {
		throw new Error('File path not found');
	}

	const uri = decodeURIComponent(file.fileCopyUri);

	const fileRead = await RNFS.readFile(uri, 'base64');

	const workbook = XLSX.read(fileRead, {
		dateNF: 'yyyy"-"mm"-"dd',
	});
	const firstSheet = workbook.SheetNames[0];
	const worksheet = workbook.Sheets[firstSheet];

	const data = XLSX.utils.sheet_to_json<ExcelRowProps>(worksheet, {
		raw: false,
	});

	const products: Omit<IExcelProduct, 'id'>[] = [];

	const allCategories = await getAllCategories();
	const allBrands = await getAllBrands();
	const allStores = await getAllStores();

	for await (const product of data) {
		const tablePName = String(product[localizedName]);
		const tablePCode = String(product[localizedCode]);
		const tablePBrand = String(product[localizedBrandName]);
		const tablePCategory = String(product[localizedCategoryName]);
		const tablePStore = String(product[localizedStoreName]);

		const tableBName = String(product[localizedBName]);
		const tableBAmount = Number(product[localizedBAmount]) || undefined;
		const tableBPrice = Number(product[localizedBPrice]);
		const tableBStatus = String(product[localizedBStatus]);

		const exists = products.find(p => {
			if (tablePCode !== 'undefined') {
				if (p.code && tablePCode) {
					if (p.code === tablePCode) {
						return true;
					}
					return false;
				}
			}
			if (tablePName && tablePName !== 'undefined') {
				if (p.name === tablePName) {
					return true;
				}
				return false;
			}

			return false;
		});

		let date = product[localizedBExp];
		date = parseISO(date);

		if (isNaN(date)) {
			date = String(product[localizedBExp])
				.split('/')
				.reverse()
				.join('/');
			date = parseISO(date.replace(/\//g, '-'));
		}

		const price = product[localizedBPrice] ? tableBPrice : undefined;

		if (!exists) {
			let brand = allBrands.find(
				bra =>
					bra.name.toLowerCase().trim() ===
					tablePBrand.toLowerCase().trim()
			);
			let category = allCategories.find(
				cat =>
					cat.name.toLowerCase().trim() ===
					tablePCategory.toLowerCase().trim()
			);
			let store = allStores.find(
				sto =>
					sto.name.toLowerCase().trim() ===
					tablePStore.toLowerCase().trim()
			);

			if (
				!brand &&
				tablePBrand.length > 0 &&
				tablePBrand !== 'undefined'
			) {
				brand = await createBrand(tablePBrand);
				allBrands.push(brand);
			}
			if (
				!category &&
				tablePCategory.length > 0 &&
				tablePCategory !== 'undefined'
			) {
				category = await createCategory(tablePCategory);
				allCategories.push(category);
			}
			if (
				!store &&
				tablePStore.length > 0 &&
				tablePStore !== 'undefined'
			) {
				store = await createStore(tablePStore);
				allStores.push(store);
			}

			const lotes: Omit<IBatch, 'id'>[] = [];

			if (product[localizedBExp]) {
				let fixedStatus = 'Não tratado';

				const currentStatus = tableBStatus.toLowerCase().trim();

				if (
					currentStatus === 'já verificado' ||
					currentStatus === 'checked'
				) {
					fixedStatus = 'Tratado';
				}

				lotes.push({
					name: tableBName,
					exp_date: date,
					amount: tableBAmount,
					price,
					status: fixedStatus,
				});
			}

			products.push({
				name: tablePName,
				code: tablePCode,
				batches: lotes,
				categories: !!category ? [category.id] : [],
				brand: !!brand ? brand.id : undefined,
				store: !!store ? store.id : undefined,
			});
		} else {
			const index = findProductIndex({ products, product: exists });

			if (index >= 0 && product[localizedBExp]) {
				products[index].batches = [
					...products[index].batches,
					{
						name: tableBName,
						exp_date: date,
						amount: tableBAmount,
						price,
						status: tableBStatus,
					},
				];
			}
		}
	}

	await saveMany(products);
}

export { importExcel };
