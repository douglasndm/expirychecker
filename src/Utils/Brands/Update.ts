import { UpdateMode } from 'realm';

import realm from '@expirychecker/Services/Realm';

async function updateBrand(brand: IBrand): Promise<void> {
	const updatedBrand: IBrand = {
		...brand,
		id: brand.id,
		name: brand.name,

		updated_at: new Date(),
	};

	realm.write(() => {
		realm.create('Brand', updatedBrand, UpdateMode.Modified);
	});
}
export { updateBrand };
