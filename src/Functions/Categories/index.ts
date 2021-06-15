import Realm from '~/Services/Realm';

export async function saveManyCategories(
    categories: Array<ICategory>
): Promise<void> {
    const realm = await Realm();

    realm.write(() => {
        categories.forEach(cat => {
            realm.create('Category', cat);
        });
    });
}
