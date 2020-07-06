import React from 'react';
import { View, ScrollView, FlatList, Alert } from 'react-native';

import { Container, HeaderContainer, TextLogo, CategoryDetails, CategoryDetailsText } from './styles';
import ProductItem from '../../Components/Product';

import { products } from '../../products.json';

const Home = ({ navigation }) => {
    //console.log(navigation);

    // navigation.toggleDrawer();
    return (
        <Container>
            <HeaderContainer>
                <TextLogo>Controle de validade</TextLogo>
            </HeaderContainer>

            <View>
                <CategoryDetails>
                    <CategoryDetailsText>Produtos mais próximos ao vencimento</CategoryDetailsText>
                    <CategoryDetailsText>-></CategoryDetailsText>
                </CategoryDetails>

                <FlatList
                    data={products}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <ProductItem product={item} />}
                />
            </View>
        </Container>
    );
};

export default Home;
