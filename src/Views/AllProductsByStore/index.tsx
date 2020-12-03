import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView } from 'react-native';

import { GetAllProductsOrderedByStore } from '../../Functions/StoresGroup';

import StoreGroup from '../../Components/StoreGroup';
import Header from '../../Components/Header';

import { Container } from './styles';

const AllProductsByStore: React.FC = () => {
    const [allProducts, setAllProducsts] = useState<IStoreGroup[]>([]);

    const loadData = useCallback(async () => {
        const response = await GetAllProductsOrderedByStore({ limit: 5 });

        setAllProducsts(response);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <Container>
            <ScrollView>
                <Header title="Produtos por loja" />
                {allProducts.map((storeGroup) => (
                    <StoreGroup
                        key={storeGroup.name}
                        storeName={storeGroup.name}
                        products={storeGroup.products}
                    />
                ))}
            </ScrollView>
        </Container>
    );
};

export default AllProductsByStore;
