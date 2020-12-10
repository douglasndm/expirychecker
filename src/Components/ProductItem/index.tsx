import React, { useContext, useMemo, useState } from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';
import { addDays, isPast } from 'date-fns';

import ProductCard from '../ProductCard';

import PreferencesContext from '../../Contexts/PreferencesContext';

import { Container, AdView } from './styles';

interface RequestProps {
    product: IProduct;
    index?: number;
    disableAds?: boolean;
}

const ProductItem: React.FC<RequestProps> = ({
    product,
    index,
    disableAds,
}: RequestProps) => {
    const { userPreferences } = useContext(PreferencesContext);

    const [adFailed, setAdFailed] = useState(false);

    const expired = useMemo(() => {
        return product.lotes[0] && isPast(product.lotes[0].exp_date);
    }, [product.lotes]);

    const nextToExp = useMemo(() => {
        return (
            product.lotes[0] &&
            addDays(new Date(), userPreferences.howManyDaysToBeNextToExpire) >=
                product.lotes[0].exp_date
        );
    }, [userPreferences.howManyDaysToBeNextToExpire, product.lotes]);

    const adUnitId = useMemo(() => {
        return __DEV__
            ? TestIds.BANNER
            : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;
    }, []);

    const showAd = useMemo(() => {
        if (disableAds) return false;
        if (userPreferences.isUserPremium) return false;
        if (adFailed) return false;
        if (index === 0) return false;
        if (index && index % 5 === 0) return true;
        return false;
    }, [disableAds, userPreferences.isUserPremium, index, adFailed]);

    return (
        <Container>
            {showAd && (
                <AdView>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.BANNER}
                        onAdFailedToLoad={() => setAdFailed(true)}
                    />
                </AdView>
            )}

            <ProductCard
                product={product}
                expired={expired}
                nextToExp={nextToExp}
            />
        </Container>
    );
};

export default React.memo(ProductItem);
