import realm from '@expirychecker/Services/Realm';

export async function deleteManyBatches(
	batchesIds: Array<number>
): Promise<void> {
	const query = batchesIds.map(id => `id = ${id}`).join(' OR ');

	const batches = realm.objects('Lote').filtered(`(${query})`);

	realm.write(async () => {
		realm.delete(batches);
	});
}
