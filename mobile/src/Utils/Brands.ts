import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import Realm from '~/Services/Realm';

import strings from '~/Locales';

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
        name: brandName,
    };

    realm.write(() => {
        realm.create<IBrand>('Brand', brand, UpdateMode.Never);
    });

    return brand;
}

/// /// A

export async function updateCategory(category: ICategory): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        realm.create('Category', category, UpdateMode.Modified);
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

interface deleteCategoryProps {
    category_id: string;
}

export async function deleteCategory({
    category_id,
}: deleteCategoryProps): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        const products = realm.objects<IProduct>('Product');

        const prodsToDelete = products.filter(prod => {
            const inc = prod.categories.find(cat => cat === category_id);

            if (inc && inc.length > 0) {
                return true;
            }
            return false;
        });

        prodsToDelete.forEach(prod => {
            prod.categories = [];
        });
    });

    const product = realm
        .objects<ICategory>('Category')
        .filtered(`id == "${category_id}"`)[0];

    realm.write(async () => {
        realm.delete(product);
    });
}
