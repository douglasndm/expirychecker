import { getAllStoresNames, getAllProductsByStore } from './Stores';
import { getAllProductsWithoutStore } from './Products';

interface RequestProps {
    limit?: number;
}

export async function GetAllProductsOrderedByStore({
    limit,
}: RequestProps): Promise<Array<IStoreGroup>> {
    const storeGroup: Array<IStoreGroup> = [];

    const stores = await getAllStoresNames();

    for (const store of stores) { // eslint-disable-line
        const products = limit
            ? await getAllProductsByStore({ store, limit })
            : await getAllProductsByStore({ store });

        storeGroup.push({
            name: store,
            products,
        });
    }

    const productsWithoutStore = await getAllProductsWithoutStore();

    storeGroup.push({
        name: 'Sem loja',
        products: limit
            ? productsWithoutStore.slice(0, limit)
            : productsWithoutStore,
    });

    return storeGroup;
}
