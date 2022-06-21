import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import strings from '~/Locales';

import realm from '~/Services/Realm';

export async function getCategory(id: string): Promise<ICategory> {
    const realmResponse = realm
        .objects<ICategory>('Category')
        .filtered(`id = "${id}"`)[0];

    return realmResponse;
}

export async function getAllCategories(): Promise<Array<ICategory>> {
    const realmResponse = realm.objects<ICategory>('Category').slice();

    return realmResponse;
}

// this return the category uuid
export async function createCategory(categoryName: string): Promise<ICategory> {
    const categories = await getAllCategories();

    const categoryAlreadyExists = categories.find(
        category => category.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (categoryAlreadyExists) {
        throw new Error(
            strings.Function_Category_AddCategory_Error_AlreadyExists
        );
    }

    const categoryUuid = await UUID.getRandomUUID();

    const category: ICategory = {
        id: categoryUuid,
        name: categoryName.trim(),
    };

    realm.write(() => {
        realm.create<ICategory>('Category', category, UpdateMode.Never);
    });

    return category;
}

export async function updateCategory(category: ICategory): Promise<void> {
    realm.write(() => {
        realm.create('Category', category, UpdateMode.Modified);
    });
}

export async function getAllProductsByCategory(
    categoryUuid: string
): Promise<Array<IProduct>> {
    const products = realm.objects<IProduct>('Product').slice();

    const filtedProducts = products.filter(p => {
        const isInCategory = p.categories.find(c => c === categoryUuid);

        if (isInCategory) return true;
        return false;
    });

    return filtedProducts;
}

interface deleteCategoryProps {
    category_id: string;
}

export async function deleteCategory({
    category_id,
}: deleteCategoryProps): Promise<void> {
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
