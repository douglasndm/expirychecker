import { UpdateMode } from 'realm';
import UUID from 'react-native-uuid-generator';

import realm from '@expirychecker/Services/Realm';

import strings from '@expirychecker/Locales';

import { getAllCategories } from './All';

// this return the category uuid
async function createCategory(categoryName: string): Promise<ICategory> {
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
		_id: categoryUuid,
		id: categoryUuid,
		name: categoryName.trim(),
	};

	realm.write(() => {
		realm.create<ICategory>('Category', category, UpdateMode.Never);
	});

	return category;
}

export { createCategory };
