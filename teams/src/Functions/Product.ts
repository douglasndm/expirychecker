import Realm from '../Services/Realm';
import { createLote } from './Lotes';

export async function checkIfProductAlreadyExistsByCode(productCode) {
    try {
        const realm = await Realm();

        const results = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)
            .slice();

        if (results.length > 0) {
            return true;
        }
        return false;
    } catch (err) {
        console.warn(err);
    }

    return false;
}

export async function getProductByCode(productCode) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function getProductById(productId) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`id = "${productId}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function createProduct(product) {
    try {
        const realm = await Realm();

        if (await checkIfProductAlreadyExistsByCode(product.code)) {
            const productLotes = product.lotes.slice();

            if (productLotes.length < 1) {
                throw new Error(
                    'Produto já existe. Não há lotes para adicionar'
                );
            }

            productLotes.map(async (l) => {
                await createLote(l, product.code);
            });
        } else {
            // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
            // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
            const lastProduct = realm.objects('Product').sorted('id', true)[0];
            const nextProductId = lastProduct == null ? 1 : lastProduct.id + 1;

            realm.write(async () => {
                await realm.create('Product', {
                    id: nextProductId,
                    name: product.name,
                    code: product.code,
                    lotes: [],
                });

                product.lotes.map(async (l) => {
                    await createLote(l, product.code);
                });
            });
        }
    } catch (err) {
        console.warn(err.message);
    }
}
