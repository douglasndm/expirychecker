import React, { useContext, useMemo } from 'react';

import ProductCard from '~/Components/ListProducts/ProductCard';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { Container } from './styles';
import FastSubscription from '~/Components/FastSubscription';

interface RequestProps {
    product: IProduct;
    index?: number;
    disableAds?: boolean;
}

const ProductContainer: React.FC<RequestProps> = ({
    product,
    index,
    disableAds,
}: RequestProps) => {
    const { userPreferences } = useContext(PreferencesContext);

    const showAd = useMemo(() => {
        if (disableAds) return false;
        if (userPreferences.disableAds) return false;
        if (index === 0) return false;
        if (index && index % 5 === 0) return true;
        return false;
    }, [disableAds, userPreferences.disableAds, index]);

    return (
        <Container>
            {showAd && <FastSubscription />}

            <ProductCard product={product} />
        </Container>
    );
};

export default React.memo(ProductContainer);
