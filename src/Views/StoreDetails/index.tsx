import React, { useCallback, useEffect, useState } from 'react';

import {
    getAllProductsByStore,
    getAllProductsWithoutStore,
} from '../../Functions/Store';

import Loading from '../../Components/Loading';
import Header from '../../Components/Header';
import ListProducts from '../../Components/ListProducts';

import { Container, StoreTitle } from './styles';

interface RequestProps {
    route: {
        params: {
            storeName: string;
        };
    };
}

const StoreDetails: React.FC<RequestProps> = ({ route }: RequestProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<IProduct[]>([]);

    const { storeName } = route.params;

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            let results: Array<IProduct> = [];

            if (storeName === 'Sem loja') {
                results = await getAllProductsWithoutStore();
            } else {
                results = await getAllProductsByStore({ store: storeName });
            }

            setProducts(results);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }, [storeName]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header />

            <StoreTitle>Todos os produtos da loja {storeName}</StoreTitle>

            <ListProducts products={products} />
        </Container>
    );
};

export default StoreDetails;
