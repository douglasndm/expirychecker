import realm from '@expirychecker/Services/Realm';

export async function saveManyBatches(
	batches: Array<IBatch>
): Promise<IBatch[]> {
	const lastBatch = realm.objects<IBatch>('Lote').sorted('id', true)[0];
	let nextId = lastBatch == null ? 1 : lastBatch.id + 1;

	const createdBatches: Array<IBatch> = [];

	realm.write(() => {
		batches.forEach(batch => {
			const createdBatch = realm.create<IBatch>('Lote', {
				...batch,
				id: nextId,
				name: batch.name ? batch.name : String(nextId),
			});

			createdBatches.push(createdBatch);

			nextId += 1;
		});
	});

	return createdBatches;
}
