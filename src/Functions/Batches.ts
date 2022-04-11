import Realm from '~/Services/Realm';

export function removeCheckedBatches(batches: Array<ILote>): Array<ILote> {
    const filted = batches.filter(batch => batch.status !== 'checked');

    return filted;
}

export async function saveManyBatches(batches: Array<ILote>): Promise<ILote[]> {
    const realm = await Realm();

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
