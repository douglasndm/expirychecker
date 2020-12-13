import Realm from '../Services/Realm';

interface getAllProductsByStoreProps {
    store: string;
    limit?: number;
}

export async function getAllProductsByStore({
    store,
    limit,
}: getAllProductsByStoreProps): Promise<Array<IProduct>> {
    const realm = await Realm();

    try {
        const results = realm
            .objects<IProduct>('Product')
            .filtered(`store = '${store}'`)
            .slice();

        if (limit) {
            const limitedResults = results.slice(0, limit);
            return limitedResults;
        }

        return results;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getAllProductsWithoutStore(): Promise<Array<IProduct>> {
    const realm = await Realm();

    try {
        const results = realm
            .objects<IProduct>('Product')
            .filtered(`store == null OR store == ''`)
            .slice();

        return results;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getAllStores(): Promise<Array<string>> {
    const realm = await Realm();

    try {
        const stores: Array<string> = [];

        const results = realm.objects<IProduct>('Product').sorted('store');

        results.forEach((product) => {
            if (product.store) {
                const temp = stores.find((store) => store === product.store);

                if (!temp) {
                    stores.push(product.store);
                }
            }
        });

        return stores;
    } catch (err) {
        throw new Error(err);
    }
}
