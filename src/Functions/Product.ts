import { getConnection } from '../Services/TypeORM';

import { Product } from '../Models/Product';
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

export async function getProductByCode(
    productCode: string
): Promise<IProduct | undefined> {
    const connection = await getConnection();
    try {
        const productRepository = connection.getRepository(Product);

        const product = await productRepository.findOne({
            where: {
                code: productCode,
            },
        });

        return product;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function getProductById(
    productId: number
): Promise<IProduct | undefined> {
    const connection = await getConnection();
    try {
        const productRepository = connection.getRepository(Product);

        const product = await productRepository.findOne({
            where: {
                id: productId,
            },
        });

        return product;
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
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

export async function deleteProduct(productId: number): Promise<void> {
    const connection = await getConnection();
    try {
        const productRepository = connection.getRepository(Product);

        const product = await productRepository.findOne({
            where: {
                id: productId,
            },
        });

        if (!product) {
            throw new Error('Produto não encontrado');
        }

        await productRepository.delete(product);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}
