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
