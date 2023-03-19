import React, { useContext, useMemo } from 'react';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import ProductCard from '@expirychecker/Components/ListProducts/ProductCard';
import FastSubscription from '@expirychecker/Components/FastSubscription';

import { Container } from './styles';

interface RequestProps {
	product: IProduct;
	index?: number;
	disableAds?: boolean;
	handleEnableSelect: () => void;
}

const ProductContainer: React.FC<RequestProps> = ({
	product,
	index,
	disableAds,
	handleEnableSelect,
}: RequestProps) => {
	const { userPreferences } = useContext(PreferencesContext);

	const showAd = useMemo(() => {
		if (disableAds) return false;
		if (userPreferences.disableAds || userPreferences.isPRO) return false;
		if (index === 0) return false;
		if (index && index % 5 === 0) return true;
		return false;
	}, [disableAds, userPreferences.disableAds, userPreferences.isPRO, index]);

	return (
		<Container>
			{showAd && <FastSubscription />}

			<ProductCard product={product} onLongPress={handleEnableSelect} />
		</Container>
	);
};

export default React.memo(ProductContainer);
