import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import { getDaysToBeNextToExp } from '../../Functions/Settings';
import { GetPremium } from '../../Functions/Premium';

import Header from '../Header';
import ProductItem from '../ProductItem';
import GenericButton from '../Button';

import {
    Container,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    isHome?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    isHome,
}: RequestProps) => {
    const navigation = useNavigation();

    const [daysToBeNext, setDaysToBeNext] = useState<number>(30);
    const [isPremium, setIsPremium] = useState(false);

    const adUnitId = __DEV__
        ? TestIds.BANNER
        : EnvConfig.ANDROID_ADMOB_ADUNITID_BETWEENPRODUCTS;

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNextToExp();
            setDaysToBeNext(days);

            setIsPremium(await GetPremium());
        }

        getAppData();
    }, []);

    const ListHeader = useCallback(() => {
        return (
            <View>
                <Header isHome={isHome} isPremium={isPremium} />
                {/* Verificar se há items antes de criar o titulo */}
                {products.length > 0 && (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            Produtos mais próximos ao vencimento
                        </CategoryDetailsText>
                    </CategoryDetails>
                )}
            </View>
        );
    }, [isPremium, isHome, products.length]);

    const EmptyList = useCallback(() => {
        return (
            <EmptyListText>
                Não há nenhum produto cadastrado ainda...
            </EmptyListText>
        );
    }, []);

    const FooterButton = useCallback(() => {
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
    }, [products.length, isHome, navigation]);

    const renderComponent = useCallback(
        ({ item, index }) => {
            return (
                <ProductItem
                    product={item}
                    index={index}
                    adUnitId={adUnitId}
                    daysToBeNext={daysToBeNext}
                    isPremium={isPremium}
                />
            );
        },
        [adUnitId, daysToBeNext, isPremium]
    );

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={(item, index) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
                initialNumToRender={10}
                removeClippedSubviews
            />
        </Container>
    );
};

export default ListProducts;
