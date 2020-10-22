import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';
import { addDays, isPast } from 'date-fns';

import ProductCard from '../ProductCard';

import PreferencesContext from '../../Contexts/PreferencesContext';

import { AdView } from './styles';

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
    const { howManyDaysToBeNextToExpire, isUserPremium } = useContext(
        PreferencesContext
    );

    const [adFailed, setAdFailed] = useState(false);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;

    const expired = product.lotes[0] && isPast(product.lotes[0].exp_date);
    const nextToExp =
        product.lotes[0] &&
        addDays(new Date(), howManyDaysToBeNextToExpire) >=
            product.lotes[0].exp_date;

    return (
        <View>
            {!disableAds &&
                !isUserPremium &&
                !!index &&
                index !== 0 &&
                index % 5 === 0 &&
                !adFailed && (
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
        </View>
    );
};

export default React.memo(ProductItem);
