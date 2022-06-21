import realm from '~/Services/Realm';

export async function saveMany(products: Array<IProduct>): Promise<void> {
    const lastProd = realm.objects<ILote>('Product').sorted('id', true)[0];
    let nextProdId = lastProd == null ? 1 : lastProd.id + 1;

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
                id: nextProdId,
                lotes: batches,
            };

            realm.create('Product', product);

            nextProdId += 1;
        });
    });
}
