import React, { useState } from 'react';
import { View } from 'react-native';
import { BannerAd, BannerAdSize } from '@react-native-firebase/admob';
import crashlytics from '@react-native-firebase/crashlytics';
import { addDays, isPast } from 'date-fns';

import ProductCard from '../ProductCard';

import { AdView } from './styles';

interface RequestProps {
    product: IProduct;
    index: number;
    adUnitId: string;
    daysToBeNext: number;
    isPremium: boolean;
}

const ProductItem: React.FC<RequestProps> = ({
    product,
    index,
    adUnitId,
    daysToBeNext,
    isPremium,
}: RequestProps) => {
    const [adFailed, setAdFailed] = useState(false);

    const expired = product.lotes[0] && isPast(product.lotes[0].exp_date);
    const nextToExp =
        product.lotes[0] &&
        addDays(new Date(), daysToBeNext) >= product.lotes[0].exp_date;

    return (
        <View>
            {!isPremium && index !== 0 && index % 5 === 0 && !adFailed && (
                <AdView>
                    <BannerAd
                        unitId={adUnitId}
                        size={BannerAdSize.BANNER}
                        onAdFailedToLoad={(err: Error) => {
                            setAdFailed(true);
                            crashlytics().log(
                                `Falha ao carregar o anúncio ${err}`
                            );
                        }}
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
