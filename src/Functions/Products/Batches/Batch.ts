import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

export function updateBatch(batch: IBatch): void {
	realm.write(() => {
		realm.create('Lote', batch, UpdateMode.Modified);
	});
}
