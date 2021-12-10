import Realm from '~/Services/Realm';

interface deleteManyProductsProps {
    productsIds: Array<number>;
}

export async function deleteManyProducts({
    productsIds,
}: deleteManyProductsProps): Promise<void> {
    const query = productsIds.map(id => `id = ${id}`).join(' OR ');

    const realm = await Realm();

    const prods = realm.objects('Product').filtered(`(${query})`);

    realm.write(async () => {
        realm.delete(prods);
    });
}
