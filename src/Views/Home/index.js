import React from 'react';
import { View, Text, FlatList } from 'react-native';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
} from './styles';
import ProductItem from '../../Components/Product';

import { products } from '../../products.json';

const ListHeader = () => {
    return (
        <CategoryDetails>
            <CategoryDetailsText>
                Produtos mais próximos ao vencimento
            </CategoryDetailsText>
        </CategoryDetails>
    );
};

const EmptyList = () => {
    return <Text>Não há nenhum produto cadastrado ainda...</Text>;
};

export default ({ navigation }) => {
    // console.log(navigation);

    // navigation.toggleDrawer();
    return (
        <Container>
            <HeaderContainer>
                <TextLogo>Controle de validade</TextLogo>
            </HeaderContainer>

            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductItem product={item} />}
                ListEmptyComponent={EmptyList}
            />
        </Container>
    );
};
