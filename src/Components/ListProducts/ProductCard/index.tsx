import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { getImagePath } from '@utils/Images/GetImagePath';

import { getProductImagePath } from '@expirychecker/Functions/Products/Image';

import { getStore } from '@expirychecker/Functions/Stores';

import Card from '@components/Product/List/Card';

interface Request {
	product: IProduct;
	onLongPress?: () => void;
	disabled?: boolean;
}

const ProductCard: React.FC<Request> = ({
	product,
	onLongPress,
	disabled,
}: Request) => {
	const { userPreferences } = useContext(PreferencesContext);

	const [imagePath, setImagePath] = useState<string | undefined>();
	const [storeName, setStoreName] = useState<string | undefined>();

	const loadImagePath = useCallback(async () => {
		const path = await getProductImagePath(product.id);

		if (path) {
			if (Platform.OS === 'android') {
				setImagePath(`file://${path}`);
			} else if (Platform.OS === 'ios') {
				setImagePath(path);
			}
		} else if (product.code) {
			const response = await getImagePath({
				productCode: product.code.trim(),
				disableRemote: true, // dont make several calls to api for each item
			});

			setImagePath(response);
		}
	}, [product.code, product.id]);

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
			disabled={disabled}
		/>
	);
};

export default ProductCard;
