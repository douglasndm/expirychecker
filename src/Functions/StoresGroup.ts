import {
    getAllProductsByStore,
    getAllProductsWithoutStore,
    getAllStores,
} from './Store';

interface RequestProps {
    limit?: number;
}

export async function GetAllProductsOrderedByStore({
    limit,
}: RequestProps): Promise<Array<IStoreGroup>> {
    const storeGroup: Array<IStoreGroup> = [];

    const stores = await getAllStores();

    stores.forEach(async (store) => {
        const products = await getAllProductsByStore({ store, limit });

        storeGroup.push({
            name: store,
            products,
        });
    });

    const productsWithoutStore = await getAllProductsWithoutStore();

    storeGroup.push({
        name: 'Sem loja',
        products: limit
            ? productsWithoutStore.slice(0, limit)
            : productsWithoutStore,
    });

    return storeGroup;
}
