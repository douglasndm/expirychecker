import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import { parseISO } from 'date-fns';

import strings from '~/Locales';

import { createBrand, getAllBrands } from '~/Utils/Brands';
import { getAllStores } from '~/Utils/Stores/Find';
import { createCategory, getAllCategories } from '~/Functions/Category';
import { saveMany } from '~/Functions/Products/index';
import { createStore } from '~/Functions/Stores';

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

    // Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
    const [, extension] = file.name.split('.');

    // caso a extensão do arquivo não for cvbf lança um erro e sai da função
    if (extension !== 'xlsx') {
        throw new Error(strings.Function_Import_Error_InvalidExtesion);
    }

    if (!file.fileCopyUri) {
        throw new Error('File path not found');
    }

    const fileRead = await RNFS.readFile(file.fileCopyUri, 'base64');

    const workbook = XLSX.read(fileRead);
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];

    const data = XLSX.utils.sheet_to_json<ExcelRowProps>(worksheet);

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
        const tableBAmount = Number(product[localizedBAmount]);
        const tableBPrice = Number(product[localizedBPrice]);
        const tableBStatus = String(product[localizedBStatus]);

        const exists = products.find(p => {
            if (p.code && tablePCode) {
                if (p.code === tablePCode) {
                    return true;
                }
                return false;
            }
            if (tablePName) {
                if (p.name === tablePName) {
                    return true;
                }
                return false;
            }

            return false;
        });

        let date = product[localizedBExp];
        date = String(date).split('/').reverse().join('/');
        date = parseISO(date.replace(/\//g, '-'));

        if (!exists) {
            let brand = allBrands.find(
                bra => bra.name.toLowerCase() === tablePBrand.toLowerCase()
            );
            let category = allCategories.find(
                cat => cat.name.toLowerCase() === tablePCategory.toLowerCase()
            );
            let store = allStores.find(
                sto => sto.name.toLowerCase() === tablePStore.toLowerCase()
            );

            if (
                !brand &&
                tablePBrand.length > 0 &&
                tablePBrand !== 'undefined'
            ) {
                brand = await createBrand(tablePBrand);
            }
            if (
                !category &&
                tablePCategory.length > 0 &&
                tablePCategory !== 'undefined'
            ) {
                category = await createCategory(tablePCategory);
            }
            if (
                !store &&
                tablePStore.length > 0 &&
                tablePStore !== 'undefined'
            ) {
                store = await createStore(tablePStore);
            }

            products.push({
                name: tablePName,
                code: tablePCode,
                lotes: [
                    {
                        lote: tableBName,
                        exp_date: date,
                        amount: tableBAmount,
                        price: tableBPrice,
                        status: tableBStatus,
                    },
                ],
                categories: !!category ? [category.id] : [],
                brand: !!brand ? brand.id : undefined,
                store: !!store ? store.id : undefined,
            });
        } else {
            const index = findProductIndex({ products, product: exists });

            if (index >= 0) {
                products[index].lotes = [
                    ...products[index].lotes,
                    {
                        lote: tableBName,
                        exp_date: date,
                        amount: tableBAmount,
                        price: tableBPrice,
                        status: tableBStatus,
                    },
                ];
            }
        }
    }

    await saveMany(products);
}

export { importExcel };
