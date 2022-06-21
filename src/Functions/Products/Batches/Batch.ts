import { UpdateMode } from 'realm';

import realm from '~/Services/Realm';

export async function updateBatch(batch: ILote): Promise<void> {
    realm.write(() => {
        realm.create('Lote', batch, UpdateMode.Modified);
    });
}
