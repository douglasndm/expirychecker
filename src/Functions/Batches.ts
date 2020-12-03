import { getConnection } from '../Services/TypeORM';
import { Batch } from '../Models/Batch';

import { getProductById } from './Product';

export function sortByBatchExpDate(batches: Array<IBatch>): Array<IBatch> {
    const sortedBatches = batches.sort((batch1, batch2) => {
        if (batch1.exp_date > batch2.exp_date) return 1;
        if (batch1.exp_date < batch2.exp_date) return -1;
        return 0;
    });

    return sortedBatches;
}

export function removeAllTreatedBatches(batches: Array<IBatch>): Array<IBatch> {
    const newBatches = batches.filter(
        (batch) => batch.status === 'Não tratado'
    );

    return newBatches;
}

interface createBatchProps {
    batch: Omit<IBatch, 'id'>;
    productId: number;
}

export async function createBatch({
    batch,
    productId,
}: createBatchProps): Promise<void> {
    const product = await getProductById(productId);

    const connection = await getConnection();

    try {
        if (!product) {
            throw new Error('Nenhum produto encontrado com este ID');
        }

        const newBatch = new Batch();
        newBatch.name = batch.name;
        newBatch.exp_date = batch.exp_date;
        newBatch.amount = batch.amount;
        newBatch.price = batch.price;
        newBatch.status = batch.status;
        newBatch.product = product;

        const batchRepository = connection.getRepository(Batch);
        await batchRepository.save(newBatch);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function updateBatch(batch: IBatch): Promise<void> {
    const connection = await getConnection();

    try {
        const batchRepository = connection.getRepository(Batch);

        const batchInDatabase = await batchRepository.findOne({
            where: { id: batch.id },
        });

        if (!batchInDatabase) {
            throw new Error('Lote não encontrado');
        }

        batchInDatabase.name = batch.name;
        batchInDatabase.exp_date = batch.exp_date;
        batchInDatabase.amount = batch.amount;
        batchInDatabase.price = batch.price;
        batchInDatabase.status = batch.status;

        await batchRepository.save(batchInDatabase);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}

export async function deleteBatch(batchId: number): Promise<void> {
    const connection = await getConnection();

    try {
        const batchRepository = connection.getRepository(Batch);

        const batch = await batchRepository.findOne({
            where: {
                id: batchId,
            },
        });

        if (!batch) {
            throw new Error('Lote não encontrado');
        }

        await batchRepository.delete(batch);
    } catch (err) {
        throw new Error(err);
    } finally {
        await connection.close();
    }
}
