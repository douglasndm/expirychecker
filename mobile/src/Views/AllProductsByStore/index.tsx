import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';

import { GetAllProductsOrderedByStore } from '../../Functions/StoresGroup';

import StoreGroup from '../../Components/StoreGroup';
import Header from '../../Components/Header';

import { Container } from './styles';

const AllProductsByStore: React.FC = () => {
    const [allProducts, setAllProducsts] = useState<IStoreGroup[]>([]);

    useEffect(() => {
        GetAllProductsOrderedByStore().then((data) => setAllProducsts(data));
    }, []);

    return (
        <Container>
            <ScrollView>
                <Header title="Todos os produtos por loja" />
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
