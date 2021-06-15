import Realm from '~/Services/Realm';

export async function saveMany(products: Array<IProduct>): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        products.forEach(prod => {
            const lastLote = realm.objects<ILote>('Lote').sorted('id', true)[0];
            let lastLoteId = lastLote == null ? 0 : lastLote.id;

            const batches = prod.lotes.map(batch => {
                lastLoteId += 1;

                return {
                    ...batch,
                    id: lastLoteId,
                };
            });

            const product: IProduct = {
                ...prod,
                lotes: batches,
            };

            realm.create('Product', product);
        });
    });
}
