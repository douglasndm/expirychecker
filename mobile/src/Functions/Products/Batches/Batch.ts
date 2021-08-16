import { UpdateMode } from 'realm';

import Realm from '~/Services/Realm';

export async function updateBatch(batch: ILote): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        realm.create('Lote', batch, UpdateMode.Modified);
    });
}
