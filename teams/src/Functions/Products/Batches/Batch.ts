import { startOfDay } from 'date-fns';

import api from '~/Services/API';

interface getBatchProps {
    batch_id: string;
}
interface getBatchResponse {
    product: IProduct;
    batch: IBatch;
}
export async function getBatch({
    batch_id,
}: getBatchProps): Promise<getBatchResponse> {
    try {
        const response = await api.get(`/batches/${batch_id}`);

        const responseData: getBatchResponse = {
            product: response.data.product,
            batch: response.data,
        };
        return responseData;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface createBatchProps {
    productId: string;
    batch: Omit<IBatch, 'id'>;
}

export async function createBatch({
    productId,
    batch,
}: createBatchProps): Promise<IBatch> {
    try {
        const date = startOfDay(new Date(batch.exp_date));

        let body: any = {
            product_id: productId,
            name: batch.name,
            exp_date: date,
            amount: batch.amount,
            status: batch.status,
        };

        if (batch.price) {
            body = {
                ...body,
                price: batch.price,
            };
        }

        const response = await api.post<IBatch>(`/batches`, body);

        return response.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface updatebatchProps {
    batch: IBatch;
}

export async function updateBatch({
    batch,
}: updatebatchProps): Promise<IBatch> {
    try {
        const response = await api.put<IBatch>(`/batches/${batch.id}`, {
            name: batch.name,
            exp_date: batch.exp_date,
            amount: batch.amount,
            price: batch.price,
            status: batch.status,
        });

        return response.data;
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}

interface deleteBatchProps {
    batch_id: string;
}

export async function deleteBatch({
    batch_id,
}: deleteBatchProps): Promise<void> {
    try {
        await api.delete<IBatch>(`/batches/${batch_id}`);
    } catch (err) {
        if (err.response.data.message) {
            throw new Error(err.response.data.message);
        }
        throw new Error(err.message);
    }
}
