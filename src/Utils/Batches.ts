import realm from '~/Services/Realm';

interface deleteManyBatchesProps {
    batchesIds: Array<number>;
}

export async function deleteManyBatches({
    batchesIds,
}: deleteManyBatchesProps): Promise<void> {
    const query = batchesIds.map(id => `id = ${id}`).join(' OR ');

    const batches = realm.objects('Lote').filtered(`(${query})`);

    realm.write(async () => {
        realm.delete(batches);
    });
}
