import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorange from '@react-native-community/async-storage';
import { useTheme, Button } from 'react-native-paper';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';
import { addDays, isPast } from 'date-fns';

import Ionicons from 'react-native-vector-icons/Ionicons';

import ProductItem from '../Product';
import GenericButton from '../Button';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
} from './styles';

async function getDaysToBeNext() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.log(err);
    }

    return 30;
}

export default function ListProducts({ products, isHome }) {
    const navigation = useNavigation();
    const theme = useTheme();

    const [daysToBeNext, setDaysToBeNext] = useState();

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNext();
            setDaysToBeNext(days);
        }

        getAppData();
    }, []);

    const ListHeader = () => {
        return (
            <View>
                {isHome ? (
                    <HeaderContainer
                        style={{ backgroundColor: theme.colors.accent }}
                    >
                        <Button
                            color="transparent"
                            icon={() => (
                                <Ionicons
                                    name="menu-outline"
                                    size={38}
                                    color="white"
                                />
                            )}
                            accessibilityLabel="Botão para abrir o menu"
                            onPress={() => navigation.toggleDrawer()}
                        />
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
            <Text
                style={{
                    marginLeft: 15,
                    marginRight: 15,
                    color: theme.colors.text,
                }}
            >
                Não há nenhum produto cadastrado ainda...
            </Text>
        );
    };

    function FooterButton() {
        if (products.length > 5 && isHome) {
            return (
                <GenericButton
                    text="Mostrar todos os produtos"
                    onPress={() => {
                        navigation.push('AllProducts');
                    }}
                />
            );
        }

        return (
            <GenericButton
                text="Cadastrar um produto"
                onPress={() => {
                    navigation.push('AddProduct');
                }}
            />
        );
    }

    function renderComponent({ item, index }) {
        const expired =
            item.lotes[0] && isPast(item.lotes[0].exp_date, new Date());
        const nextToExp =
            item.lotes[0] &&
            addDays(new Date(), daysToBeNext) > item.lotes[0].exp_date;

        return (
            <>
                {index !== 0 && index % 5 === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            marginTop: 5,
                            marginBottom: 5,
                        }}
                    >
                        <BannerAd
                            unitId={adUnitId}
                            size={BannerAdSize.BANNER}
                        />
                    </View>
                ) : null}

                <ProductItem
                    product={item}
                    daysToBeNext={daysToBeNext}
                    expired={expired}
                    nextToExp={nextToExp}
                />
            </>
        );
    }

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <FlatList
                data={products}
                keyExtractor={(item, index) => {
                    return !item.code ? String(item.code) : String(index);
                }}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
                initialNumToRender="10"
                removeClippedSubviews
            />
        </Container>
    );
}
