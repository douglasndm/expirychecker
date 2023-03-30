import React, { useContext } from 'react';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import ProductCard from '@expirychecker/Components/ListProducts/ProductCard';
import FastSubscription from '@expirychecker/Components/FastSubscription';

import { Container } from './styles';

interface RequestProps {
	product: IProduct;
	index?: number;
	disableAds?: boolean;
	handleEnableSelect: () => void;
	disabled?: boolean;
}

const ProductContainer: React.FC<RequestProps> = ({
	product,
	index = 0,
	disableAds,
	handleEnableSelect,
	disabled,
}: RequestProps) => {
	const { userPreferences } = useContext(PreferencesContext);

	const showAd = disableAds
		? false
		: !userPreferences.disableAds &&
		  !userPreferences.isPRO &&
		  index !== 0 &&
		  index % 5 === 0;

	return (
		<Container>
			{showAd && <FastSubscription />}

			<ProductCard
				product={product}
				onLongPress={handleEnableSelect}
				disabled={disabled}
			/>
		</Container>
	);
};

export default React.memo(ProductContainer);
