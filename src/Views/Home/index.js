import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';

import CalendarAnimation from '../../Assets/Animations/Calendar_date.json';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
    ButtonLoadMore,
    ButtonLoadMoreText,
} from './styles';

import ProductDetails from '../ProductDetails';
import ProductItem from '../../Components/Product';

import { products } from '../../products.json';

const StackNavigator = createStackNavigator();

const ListHeader = () => {
    return (
        <View>
            <HeaderContainer>
                <LottieView source={CalendarAnimation} autoPlay loop />
                <TextLogo>Controle de validade</TextLogo>
            </HeaderContainer>

            <CategoryDetails>
                <CategoryDetailsText>
                    Produtos mais próximos ao vencimento
                </CategoryDetailsText>
            </CategoryDetails>
        </View>
    );
};

const EmptyList = () => {
    return <Text>Não há nenhum produto cadastrado ainda...</Text>;
};

const FooterButton = () => {
    return (
        <ButtonLoadMore onPress={() => {}}>
            <ButtonLoadMoreText>Mostrar todos os produtos</ButtonLoadMoreText>
        </ButtonLoadMore>
    );
};

const ProductList = () => {
    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductItem product={item} />}
                ListFooterComponent={FooterButton}
                ListEmptyComponent={EmptyList}
            />
        </Container>
    );
};

export default () => (
    <StackNavigator.Navigator headerMode="none">
        <StackNavigator.Screen name="Default" component={ProductList} />
        <StackNavigator.Screen
            name="ProductDetails"
            component={ProductDetails}
        />
    </StackNavigator.Navigator>
);
