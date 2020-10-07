import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import crashlytics from '@react-native-firebase/crashlytics';

import { getDaysToBeNextToExp } from '../../Functions/Settings';
import { GetAllProductsOrderedByStore } from '../../Functions/StoresGroup';

import ProductItem from '../../Components/ProductItem';
import Header from '../../Components/Header';

import { AdView } from '../../Components/ProductItem/styles';
import { Container, StoreGroupContainer, StoreTitle } from './styles';

const AllProductsByStore: React.FC = () => {
    const [allProducts, setAllProducsts] = useState<IStoreGroup[]>([]);
    const [daysToBeNext, setDaysToBeNext] = useState<number>(30);

    useEffect(() => {
        getDaysToBeNextToExp().then((days) => setDaysToBeNext(days));
        GetAllProductsOrderedByStore().then((data) => setAllProducsts(data));
    }, []);

    return (
        <Container>
            <ScrollView>
                <Header title="Todos os produtos por loja" />
                {allProducts.map((storeGroup) => {
                    return (
                        <StoreGroupContainer>
                            <StoreTitle>Loja {storeGroup.name}</StoreTitle>

                            {storeGroup.products.map((product) => (
                                <ProductItem
                                    product={product}
                                    daysToBeNext={daysToBeNext}
                                    disableAds
                                />
                            ))}

                            <AdView>
                                <BannerAd
                                    unitId={TestIds.BANNER}
                                    size={BannerAdSize.BANNER}
                                />
                            </AdView>
                        </StoreGroupContainer>
                    );
                })}
            </ScrollView>
        </Container>
    );
};

export default AllProductsByStore;
