import {
    GetAllProductsByStore,
    GetAllProductsWithoutStore,
    getAllStores,
} from './Products';

export async function GetAllProductsOrderedByStore(): Promise<
    Array<IStoreGroup>
> {
    const storeGroup: Array<IStoreGroup> = [];

    const stores = await getAllStores();

    stores.forEach(async (store) => {
        const products = await GetAllProductsByStore(store);

        storeGroup.push({
            name: store,
            products,
        });
    });

    const productsWithoutStore = await GetAllProductsWithoutStore();

    storeGroup.push({
        name: 'Sem loja',
        products: productsWithoutStore,
    });

    return storeGroup;
}
