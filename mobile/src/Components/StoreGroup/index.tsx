import React, { useContext } from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import ProductItem from '../ProductItem';

import {
    sortProductsLotesByLotesExpDate,
    sortProductsByFisrtLoteExpDate,
} from '../../Functions/Products';

import PreferencesContext from '../../Contexts/PreferencesContext';

import { StoreGroupContainer, StoreTitle, AdView } from './styles';

interface IRequest {
    storeName: string;
    products: Array<IProduct>;
}

const StoreGroup: React.FC<IRequest> = ({ storeName, products }: IRequest) => {
    const { isUserPremium } = useContext(PreferencesContext);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENSTOREGROUPS;

    const resultsTemp = sortProductsLotesByLotesExpDate(products);
    const results = sortProductsByFisrtLoteExpDate(resultsTemp);

    return (
        <StoreGroupContainer>
            <StoreTitle>{storeName}</StoreTitle>

            {results.map((product) => (
                <ProductItem key={product.id} product={product} disableAds />
            ))}

            {!isUserPremium && (
                <AdView>
                    <BannerAd unitId={adUnitId} size={BannerAdSize.BANNER} />
                </AdView>
            )}
        </StoreGroupContainer>
    );
};

export default StoreGroup;
