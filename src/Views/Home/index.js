import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    const [fabOpen, setFabOpen] = React.useState(false);
    const navigation = useNavigation();

    return (
        <>
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

            <FAB.Group
                actions={[
                    {
                        icon: () => (
                            <Ionicons name="add" size={24} color="#14d48f" />
                        ),
                        label: 'Adicionar produto',
                        onPress: () => {
                            navigation.navigate('AddProduct');
                        },
                    },
                ]}
                icon={() => <Ionicons name="reader" size={24} color="#FFF" />}
                open={fabOpen}
                onStateChange={() => setFabOpen(!fabOpen)}
                visible
                onPress={() => setFabOpen(!fabOpen)}
                fabStyle={{ backgroundColor: '#14d48f' }}
            />
        </>
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
