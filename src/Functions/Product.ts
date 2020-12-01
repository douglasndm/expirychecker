import { getConnection } from '../Services/TypeORM';

import { Product } from '../Models/Product';

import Realm from '../Services/Realm';
import { createLote } from './Lotes';
import { Batch } from '../Models/Batch';

interface checkIfProductExistsProps {
    productCode: string;
    productStore?: string;
}

export async function checkIfProductExistsByCode({
    productCode,
    productStore,
}: checkIfProductExistsProps): Promise<boolean> {
    const connection = await getConnection();

    try {
        const productRepository = connection.getRepository(Product);

        if (productStore) {
            const result = await productRepository.findOne({
                where: {
                    code: productCode,
                    store: productStore,
                },
            });

            if (result) {
                return true;
            }
            return false;
        }

        const result = await productRepository.findOne({
            where: {
                code: productCode,
            },
        });

        if (result) {
            return true;
        }
        return false;
    } catch (error) {
        throw new Error(error);
    } finally {
        await connection.close();
    }
}
interface ICheckIfProductAlreadyExistsByCodeProps {
    productCode: string;
    productStore?: string;
}

export async function checkIfProductAlreadyExistsByCode({
    productCode,
    productStore,
}: ICheckIfProductAlreadyExistsByCodeProps): Promise<boolean> {
    try {
        if (productStore) {
            const results = Realm.objects('Product')
                .filtered(
                    `code = "${productCode}" AND store = "${productStore}"`
                )
                .slice();

            if (results.length > 0) {
                return true;
            }
            return false;
        }

        const results = Realm.objects('Product')
            .filtered(`code = "${productCode}"`)
            .slice();

        if (results.length > 0) {
            return true;
        }
        return false;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getProductByCode(
    productCode: string
): Promise<IProduct | null> {
    try {
        const result = Realm.objects<IProduct>('Product').filtered(
            `code = "${productCode}"`
        )[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function getProductById(
    productId: number
): Promise<IProduct | null> {
    try {
        const result = Realm.objects<IProduct>('Product').filtered(
            `id = "${productId}"`
        )[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function createProduct(
    product: Omit<IProduct, 'id'>
): Promise<void> {
    if (product.code) {
        const existProduct = await checkIfProductExistsByCode({
            productCode: product.code,
            productStore: product.store,
        });

        if (existProduct) {
            throw new Error('Produto já está cadastrado');
        }
    }

    const connection = await getConnection();

    try {
        const productRepository = connection.getRepository(Product);

        const prod = new Product();
        prod.name = product.name;
        prod.code = product.code;
        prod.store = product.store;

        prod.batches = product.batches.map((batch) => {
            const newBatch = new Batch();

            newBatch.name = batch.name;
            newBatch.exp_date = batch.exp_date;
            newBatch.amount = batch.amount;
            newBatch.price = batch.price;
            newBatch.status = batch.status;
            newBatch.product = prod;

            return newBatch;
        });

        await productRepository.save(prod);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function createProductRealm(
    product: Omit<IProduct, 'id'>
): Promise<number | void> {
    try {
        if (
            product.code &&
            (await checkIfProductAlreadyExistsByCode({
                productCode: product.code,
                productStore: product?.store,
            }))
        ) {
            const productLotes = product.lotes.slice();

            if (productLotes.length < 1) {
                throw new Error(
                    'Produto já existe. Não há lotes para adicionar'
                );
            }

            productLotes.map(async (l) => {
                await createLote({
                    productCode: product.code,
                    lote: l,
                });
            });
        } else {
            // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
            // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
            const lastProduct = Realm.objects<IProduct>('Product').sorted(
                'id',
                true
            )[0];
            const nextProductId = lastProduct == null ? 1 : lastProduct.id + 1;

            Realm.write(async () => {
                Realm.create(
                    'Product',
                    {
                        id: nextProductId,
                        name: product.name,
                        code: product.code,
                        store: product.store,
                        lotes: [],
                    },
                    false
                );
            });

            for (const l of product.lotes) {
                await createLote({
                    productId: nextProductId,
                    lote: l,
                });
            }

            return nextProductId;
        }
    } catch (err) {
        throw new Error(err);
    }
}

export async function deleteProduct(productId: number): Promise<void> {
    const product = Realm.objects('Product').filtered(`id == ${productId}`);

    Realm.write(async () => {
        Realm.delete(product);
    });
}
