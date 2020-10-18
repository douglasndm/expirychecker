import React, { useState, useEffect } from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import { AdView } from '../ProductItem/styles';
import ProductItem from '../ProductItem';

import {
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';

import { GetPremium } from '../../Functions/Premium';
import { getDaysToBeNextToExp } from '../../Functions/Settings';

import { StoreGroupContainer, StoreTitle } from './styles';

interface IRequest {
    storeName: string;
    products: Array<IProduct>;
}

const StoreGroup: React.FC<IRequest> = ({ storeName, products }: IRequest) => {
    const [daysToBeNext, setDaysToBeNext] = useState<number>(30);
    const [isPremium, setIsPremium] = useState(false);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENSTOREGROUPS;

    useEffect(() => {
        getDaysToBeNextToExp().then((days) => setDaysToBeNext(days));
        GetPremium().then((result) => setIsPremium(result));
    }, []);

    const resultsTemp = sortProductsLotesByLotesExpDate(products);
    const results = sortProductsByFisrtLoteExpDate(resultsTemp);

    return (
        <StoreGroupContainer>
            <StoreTitle>{storeName}</StoreTitle>

            {results.map((product) => (
                <ProductItem
                    key={product.id}
                    product={product}
                    daysToBeNext={daysToBeNext}
                    disableAds
                />
            ))}

            {!isPremium && (
                <AdView>
                    <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
                </AdView>
            )}
        </StoreGroupContainer>
    );
};

export default StoreGroup;
