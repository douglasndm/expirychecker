import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme, Button } from 'react-native-paper';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';
import { addDays, isPast } from 'date-fns';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { getAdsEnabled, getDaysToBeNextToExp } from '../../Functions/Settings';
import { GetPremium } from '../../Functions/Premium';

import ProductItem from '../Product';
import GenericButton from '../Button';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
} from './styles';

export default function ListProducts({ products, isHome }) {
    const navigation = useNavigation();
    const theme = useTheme();

    const [daysToBeNext, setDaysToBeNext] = useState();
    const [adsEnabled, setAdsEnabled] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNextToExp();
            setDaysToBeNext(days);

            if (await getAdsEnabled()) {
                setAdsEnabled(true);
            } else {
                setAdsEnabled(false);
            }

            setIsPremium(await GetPremium());
        }

        getAppData();
    }, []);

    const ListHeader = () => {
        const titleFontSize = PixelRatio.get() < 1.5 ? 22 : 28;

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
                            compact
                            accessibilityLabel="Botão para abrir o menu"
                            onPress={() => navigation.toggleDrawer()}
                        />
                        <TextLogo style={{ fontSize: titleFontSize }}>
                            {isPremium ? 'Premium' : 'Controle de validade'}
                        </TextLogo>
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
                {adsEnabled && index !== 0 && index % 5 === 0 ? (
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
                            onAdFailedToLoad={() => {
                                console.log('Falha com carregar anúncios');
                            }}
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

    function keyExtractor(item, index) {
        return String(index);
    }

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <FlatList
                data={products}
                keyExtractor={keyExtractor}
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
