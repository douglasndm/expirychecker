import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import List from '@views/Category/List';

import { createCategory } from '@expirychecker/Utils/Categories/Create';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';

const CategoryList: React.FC = () => {
	const { addListener } = useNavigation();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [categories, setCategories] = useState<ICategory[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const cats = await getAllCategories();

			setCategories(cats);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, []);

	const createCategoryProgress = useCallback(
		async (name: string) => {
			try {
				setIsAdding(true);

				const newCategory = await createCategory(name);

				setCategories([...categories, newCategory]);
			} finally {
				setIsAdding(false);
			}
		},
		[categories]
	);

	useEffect(() => {
		const unsubscribe = addListener('focus', () => {
			loadData();
		});

		return () => {
			unsubscribe();
		};
	}, [addListener, loadData]);

	return (
		<List
			categories={categories}
			isLoading={isLoading}
			isAdding={isAdding}
			createCategory={createCategoryProgress}
		/>
	);
};

export default CategoryList;
