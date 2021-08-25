import React, { useCallback, useContext, useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import ProductItem from './ProductContainer';
import GenericButton from '../Button';

import {
    Container,
    ProBanner,
    ProText,
    CategoryDetails,
    CategoryDetailsText,
    EmptyListText,
    InvisibleComponent,
    FloatButton,
    Icons,
} from './styles';

interface RequestProps {
    products: Array<IProduct>;
    isHome?: boolean;
    deactiveFloatButton?: boolean;
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const ListProducts: React.FC<RequestProps> = ({
    products,
    isHome,
    deactiveFloatButton,
    onRefresh,
    isRefreshing = false,
}: RequestProps) => {
    const { navigate } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const handleNavigateToAllProducts = useCallback(() => {
        navigate('AllProducts');
    }, [navigate]);

    const handleNavigateProPage = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const choosenAdText = useMemo(() => {
        const result = Math.floor(Math.random() * 3) + 1;

        switch (result) {
            case 1:
                return strings.ProBanner_Text1;

            case 2:
                return strings.ProBanner_Text2;

            case 3:
                return strings.ProBanner_Text3;

            default:
                return strings.ProBanner_Text4;
        }
    }, []);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {userPreferences.isUserPremium !== true && (
                    <>
                        <ProBanner onPress={handleNavigateProPage}>
                            <ProText>
                                {choosenAdText.toLocaleUpperCase()}
                            </ProText>
                        </ProBanner>
                    </>
                )}

                {/* Verificar se há items antes de criar o titulo */}
                {products.length > 0 && (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            {
                                strings.ListProductsComponent_Title_ProductsNextToExp
                            }
                        </CategoryDetailsText>
                    </CategoryDetails>
                )}
            </View>
        );
    }, [products, userPreferences.isUserPremium]);

    const EmptyList = useCallback(() => {
        return (
            <EmptyListText>
                {strings.ListProductsComponent_Title_NoProductsInList}
            </EmptyListText>
        );
    }, []);

    const FooterButton = useCallback(() => {
        if (products.length > 5 && isHome) {
            return (
                <GenericButton
                    text={strings.ListProductsComponent_Button_ShowAllProducts}
                    onPress={handleNavigateToAllProducts}
                    contentStyle={{ marginBottom: 100 }}
                />
            );
        }

        return <InvisibleComponent />;
    }, [products.length, isHome, handleNavigateToAllProducts]);

    const renderComponent = useCallback(({ item, index }) => {
        return <ProductItem product={item} index={index} />;
    }, []);

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={item => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={renderComponent}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
                initialNumToRender={10}
                onRefresh={onRefresh}
                refreshing={isRefreshing}
            />

            {!deactiveFloatButton && (
                <FloatButton
                    icon={() => (
                        <Icons name="add-outline" color="white" size={22} />
                    )}
                    small
                    label={strings.View_FloatMenu_AddProduct}
                    onPress={handleNavigateAddProduct}
                />
            )}
        </Container>
    );
};

export default ListProducts;
