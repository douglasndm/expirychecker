import React, { useEffect, useState } from 'react';

import { GetAllProductsByStore } from '../../Functions/Products';

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
    const [products, setProducts] = useState<IProduct[]>([]);

    const { storeName } = route.params;

    useEffect(() => {
        GetAllProductsByStore(storeName).then((response) => {
            setProducts(response);
        });
    }, [storeName]);

    return (
        <Container>
            <Header />

            <StoreTitle>Todos os produtos da loja {storeName}</StoreTitle>

            <ListProducts products={products} />
        </Container>
    );
};

export default StoreDetails;
