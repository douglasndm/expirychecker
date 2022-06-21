import realm from '~/Services/Realm';

export async function saveManyBatches(batches: Array<ILote>): Promise<ILote[]> {
    const lastBatch = realm.objects<ILote>('Lote').sorted('id', true)[0];
    let nextId = lastBatch == null ? 1 : lastBatch.id + 1;

    const createdBatches: Array<ILote> = [];

    realm.write(() => {
        batches.forEach(batch => {
            const createdBatch = realm.create<ILote>('Lote', {
                ...batch,
                id: nextId,
            });

            createdBatches.push(createdBatch);

            nextId += 1;
        });
    });

    return createdBatches;
}
