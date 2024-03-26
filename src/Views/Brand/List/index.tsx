import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import ListView from '@views/Brand/List';

import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { createBrand } from '@expirychecker/Utils/Brands/Create';

const BrandList: React.FC = () => {
	const { addListener } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isAdding, setIsAdding] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [brands, setBrands] = useState<IBrand[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const cats = await getAllBrands();

			setBrands(cats);
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

	const createBrandProgress = useCallback(
		async (name: string) => {
			try {
				setIsAdding(true);

				const newBrand = await createBrand(name);

				setBrands([...brands, newBrand]);
			} finally {
				setIsAdding(false);
			}
		},
		[brands]
	);

	useEffect(() => {
		const unsubscribe = addListener('focus', loadData);

		return () => unsubscribe();
	}, [addListener, loadData]);

	return (
		<ListView
			brands={brands}
			isLoading={isLoading}
			isAdding={isAdding}
			createBrand={createBrandProgress}
		/>
	);
};

export default BrandList;
