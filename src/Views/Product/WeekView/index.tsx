import React, { useState, useEffect, useCallback, useContext } from 'react';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';

import WeekViewComponent from '@views/Product/WeekView';

const WeekView: React.FC = () => {
	const { userPreferences } = useContext(PreferencesContext);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const prods = await getAllProductsAsync({
				sortProductsByExpDate: true,
				removeTreatedBatch: true,
			});

			setProducts(prods);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					type: 'danger',
					message: err.message,
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<WeekViewComponent
			products={products}
			howManyDaysToBeNextToExpire={
				userPreferences.howManyDaysToBeNextToExpire
			}
			isLoading={isLoading}
		/>
	);
};

export default WeekView;
