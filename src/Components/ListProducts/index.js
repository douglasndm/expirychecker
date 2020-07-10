import React from 'react';
import { View, Text, FlatList } from 'react-native';

import ProductItem from '../Product';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
    ButtonLoadMore,
    ButtonLoadMoreText,
    HackComponent,
} from './styles';

const ListProducts = ({ products, isHome }) => {
    const ListHeader = () => {
        return (
            <View>
                {isHome ? (
                    <HeaderContainer>
                        <TextLogo>Controle de validade</TextLogo>
                    </HeaderContainer>
                ) : null}

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

    // Esse hackzinho evita que o FAB Menu fique em cima do ultimo item na pagina de todos os produtos
    const ButtonHack = () => {
        return <HackComponent isHome={isHome} />;
    };

    function FooterButton() {
        if (products.length > 5 && isHome) {
            return (
                <ButtonLoadMore
                    onPress={() => {
                        navigation.navigate('AllProducts');
                    }}
                >
                    <ButtonLoadMoreText>
                        Mostrar todos os produtos
                    </ButtonLoadMoreText>
                </ButtonLoadMore>
            );
        }

        return (
            <>
                <ButtonLoadMore
                    onPress={() => {
                        navigation.navigate('AddProduct');
                    }}
                >
                    <ButtonLoadMoreText>
                        Cadastrar um produto
                    </ButtonLoadMoreText>
                </ButtonLoadMore>
            </>
        );
    }

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => <ProductItem product={item} />}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
            />
        </Container>
    );
};

export default ListProducts;
