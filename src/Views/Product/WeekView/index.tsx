import React, { useState, useEffect, useCallback, useContext } from 'react';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getAllProducts } from '@expirychecker/Functions/Products';

import WeekViewComponent from '@views/Product/WeekView';

const WeekView: React.FC = () => {
	const { userPreferences } = useContext(PreferencesContext);

	const [products, setProducts] = useState<IProduct[]>([]);

	const loadData = useCallback(async () => {
		try {
			const allProducts = await getAllProducts({
				sortProductsByExpDate: true,
				removeTreatedBatch: true,
			});

			setProducts(allProducts);
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					type: 'danger',
					message: err.message,
				});
			}
		}
	}, []);

	useEffect(() => {
		loadData();
	}, []);

	return (
		<WeekViewComponent
			products={products}
			howManyDaysToBeNextToExpire={
				userPreferences.howManyDaysToBeNextToExpire
			}
		/>
	);
};

export default WeekView;
