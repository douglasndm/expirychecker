import {
    GetAllProductsByStore,
    GetAllProductsWithoutStore,
    getAllStores,
} from './Products';

interface RequestProps {
    limit?: number;
}

export async function GetAllProductsOrderedByStore({
    limit,
}: RequestProps): Promise<Array<IStoreGroup>> {
    const storeGroup: Array<IStoreGroup> = [];

    const stores = await getAllStores();

    stores.forEach(async (store) => {
        const products = limit
            ? await GetAllProductsByStore(store, limit)
            : await GetAllProductsByStore(store);

        storeGroup.push({
            name: store,
            products,
        });
    });

    const productsWithoutStore = await GetAllProductsWithoutStore();

    storeGroup.push({
        name: 'Sem loja',
        products: limit
            ? productsWithoutStore.slice(0, limit)
            : productsWithoutStore,
    });

    return storeGroup;
}
