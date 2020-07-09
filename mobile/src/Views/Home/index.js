import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Realm from '../../Services/Realm';
import ProductItem from '../../Components/Product';

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

const StackNavigator = createStackNavigator();

export default function Home() {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    async function getProduts(realm) {
        try {
            const resultsDB = realm.objects('Product').slice();

            // classifica os produtos em geral pelo o mais proximo de vencer
            const results = resultsDB.sort((item1, item2) => {
                let lote1;
                let lote2;

                // Dentro de determinado produto, classica os lotes mais proximos
                if (item1.lotes.length > 1 && item2.lotes.length > 1) {
                    lote1 = item1.lotes.sort((lote1, lote2) => {
                        if (lote1.exp_date > lote2.exp_date) return 1;
                        if (lote1.exp_date < lote2.exp_date) return -1;
                        return 0;
                    });
                    lote2 = item2.lotes.sort((lote1, lote2) => {
                        if (lote1.exp_date > lote2.exp_date) return 1;
                        if (lote1.exp_date < lote2.exp_date) return -1;
                        return 0;
                    });
                } else {
                    lote1 = item1.lotes[0];
                    lote2 = item2.lotes[0];
                }

                if (lote1.exp_date > lote2.exp_date) return 1;
                if (lote1.exp_date < lote2.exp_date) return -1;
                return 0;
            });

            if (results.length > 10) {
                const resultsMin = [];

                for (let i = 0; i < 10; i++) resultsMin.push(results[i]);

                setProducts(resultsMin);
            } else {
                setProducts(results);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function startRealm() {
            const realm = await Realm();
            realm.addListener('change', () => getProduts(realm));

            getProduts(realm);
        }

        startRealm();
    }, []);

    const ListHeader = () => {
        return (
            <View>
                <HeaderContainer>
                    <TextLogo>Controle de validade</TextLogo>
                </HeaderContainer>

                {/* Verificar se há items antes de criar o titulo */}
                {products.length > 0 ? (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            Produtos mais próximos ao vencimento
                        </CategoryDetailsText>
                    </CategoryDetails>
                ) : null}
            </View>
        );
    };

    const EmptyList = () => {
        return (
            <Text style={{ marginLeft: 15, marginRight: 15 }}>
                Não há nenhum produto cadastrado ainda...
            </Text>
        );
    };

    function FooterButton() {
        if (products.length > 5) {
            return (
                <ButtonLoadMore onPress={() => {}}>
                    <ButtonLoadMoreText>
                        Mostrar todos os produtos
                    </ButtonLoadMoreText>
                </ButtonLoadMore>
            );
        }

        return (
            <ButtonLoadMore
                onPress={() => {
                    navigation.navigate('AddProduct');
                }}
            >
                <ButtonLoadMoreText>Cadastrar um produto</ButtonLoadMoreText>
            </ButtonLoadMore>
        );
    }

    const ProductList = () => {
        const [fabOpen, setFabOpen] = React.useState(false);

        return (
            <>
                <Container>
                    <FlatList
                        data={products}
                        keyExtractor={(item) => String(item.id)}
                        ListHeaderComponent={ListHeader}
                        renderItem={({ item }) => (
                            <ProductItem product={item} />
                        )}
                        ListFooterComponent={FooterButton}
                        ListEmptyComponent={EmptyList}
                    />
                </Container>

                <FAB.Group
                    actions={[
                        {
                            icon: () => (
                                <Ionicons
                                    name="add"
                                    size={24}
                                    color="#14d48f"
                                />
                            ),
                            label: 'Adicionar produto',
                            onPress: () => {
                                navigation.navigate('AddProduct');
                            },
                        },
                    ]}
                    icon={() => (
                        <Ionicons name="reader" size={24} color="#FFF" />
                    )}
                    open={fabOpen}
                    onStateChange={() => setFabOpen(!fabOpen)}
                    visible
                    onPress={() => setFabOpen(!fabOpen)}
                    fabStyle={{ backgroundColor: '#14d48f' }}
                />
            </>
        );
    };

    return (
        <StackNavigator.Navigator headerMode="none">
            <StackNavigator.Screen name="Default" component={ProductList} />
            <StackNavigator.Screen
                name="ProductDetails"
                component={ProductDetails}
            />
        </StackNavigator.Navigator>
    );
}
