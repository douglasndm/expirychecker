import React from 'react';
import { View, Text, FlatList, Alert } from 'react-native';

import { Container, HeaderContainer, TextLogo } from './styles';

import { products } from '../../products.json';

const Home = ({ navigation }) => {
    console.log(navigation);

    // navigation.toggleDrawer();
    return (
        <Container>
            <HeaderContainer>
                <TextLogo>Controle de validade</TextLogo>
            </HeaderContainer>

            <View>
                <Text>Produtos mais próximos ao vencimento</Text>

                <FlatList
                    data={products}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => <Text>{item.name}</Text>}
                />
            </View>
        </Container>
    );
};

export default Home;
