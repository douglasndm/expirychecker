import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import Realm from '~/Services/Realm';

import strings from '~/Locales';

export async function getBrand(id: string): Promise<IBrand> {
    const realm = await Realm();

    const realmResponse = realm
        .objects<IBrand>('Brand')
        .filtered(`id = "${id}"`)[0];

    return realmResponse;
}

export async function getAllBrands(): Promise<Array<IBrand>> {
    const realm = await Realm();

    const realmResponse = realm.objects<ICategory>('Brand').slice();

    return realmResponse;
}

export async function createBrand(brandName: string): Promise<IBrand> {
    const brands = await getAllBrands();

    const alreadyExists = brands.find(
        brand => brand.name.toLowerCase() === brandName.toLowerCase()
    );

    if (alreadyExists) {
        throw new Error(
            strings.View_Brand_List_InputAdd_Error_BrandAlreadyExists
        );
    }

    const realm = await Realm();

    const brandUuid = await UUID.getRandomUUID();

    const brand: IBrand = {
        id: brandUuid,
        name: brandName.trim(),
    };

    realm.write(() => {
        realm.create<IBrand>('Brand', brand, UpdateMode.Never);
    });

    return brand;
}

export async function updateBrand(brand: IBrand): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        realm.create('Brand', brand, UpdateMode.Modified);
    });
}

export async function getAllProductsByBrand(
    brand_id: string
): Promise<Array<IProduct>> {
    const realm = await Realm();

    const products = realm.objects<IProduct>('Product').slice();

    const filtedProducts = products.filter(p => {
        return p.brand === brand_id;
    });

    return filtedProducts;
}

export async function deleteBrand({
    brand_id,
}: deleteBrandProps): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        const products = realm.objects<IProduct>('Product');

        const prodsToDelete = products.filter(prod => {
            if (prod.brand === brand_id) return true;
            return false;
        });

        prodsToDelete.forEach(prod => {
            prod.brand = undefined;
        });
    });

    const brand = realm
        .objects<IBrand>('Brand')
        .filtered(`id == "${brand_id}"`)[0];

    realm.write(async () => {
        realm.delete(brand);
    });
}

export async function saveManyBrands(brands: Array<IBrand>): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        brands.forEach(brand => {
            realm.create('Brand', brand);
        });
    });
}
