import React, { useCallback, useContext, useEffect, useState } from 'react';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';
import { getProductImagePath } from '@expirychecker/Functions/Products/Image';

import { getStore } from '@expirychecker/Functions/Stores';

import Card from '@components/Product/List/Card';

interface Request {
	product: IProduct;
	onLongPress?: () => void;
}

const ProductCard: React.FC<Request> = ({ product, onLongPress }: Request) => {
	const { userPreferences } = useContext(PreferencesContext);

	const [imagePath, setImagePath] = useState<string | undefined>();
	const [storeName, setStoreName] = useState<string | undefined>();

	const loadImagePath = useCallback(async () => {
		const path = await getProductImagePath(product.id);

		if (path) {
			setImagePath(path);
		}
	}, [product.id]);

	const loadStoreName = useCallback(async () => {
		if (product.store) {
			const store = await getStore(product.store);

			if (store?.name) {
				setStoreName(store.name);
			}
		}
	}, [product.store]);

	useEffect(() => {
		loadImagePath();
		loadStoreName();
	}, []);

	return (
		<Card
			product={product}
			storeName={storeName}
			showImage={userPreferences.isPRO}
			imagePath={imagePath}
			daysToBeNext={userPreferences.howManyDaysToBeNextToExpire}
			onLongPress={onLongPress}
		/>
	);
};

export default ProductCard;
