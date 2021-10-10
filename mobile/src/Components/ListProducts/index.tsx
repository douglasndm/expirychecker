import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PurchasesPackage } from 'react-native-purchases';

import { showMessage } from 'react-native-flash-message';
import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    getOnlyNoAdsSubscriptions,
    makeSubscription,
} from '~/Functions/ProMode';

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
import { getDisableAds } from '~/Functions/Settings';

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

    const [noAdsPackage, setNoAdsPackages] = useState<PurchasesPackage | null>(
        null
    );

    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

    const handleNavigateToAllProducts = useCallback(() => {
        navigate('AllProducts');
    }, [navigate]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const loadRemoveAdsData = useCallback(async () => {
        const response = await getOnlyNoAdsSubscriptions();

        setNoAdsPackages(response[0]);
    }, []);

    const handleMakePurchaseNoAds = useCallback(async () => {
        if (noAdsPackage) {
            await makeSubscription(noAdsPackage);
            const ads = await getDisableAds();

            setUserPreferences({
                ...userPreferences,
                disableAds: ads,
            });

            if (ads) {
                showMessage({
                    message: strings.Banner_SubscriptionSuccess_Alert,
                    type: 'info',
                });
            }
        }
    }, [noAdsPackage, setUserPreferences, userPreferences]);

    useEffect(() => {
        loadRemoveAdsData();
    }, []);

    const ListHeader = useCallback(() => {
        return (
            <View>
                {userPreferences.disableAds === false && noAdsPackage && (
                    <ProBanner onPress={handleMakePurchaseNoAds}>
                        <ProText>
                            {strings.Banner_NoAds.replace(
                                '{PRICE}',
                                noAdsPackage.product.price_string
                            )}
                        </ProText>
                    </ProBanner>
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
    }, [
        handleMakePurchaseNoAds,
        noAdsPackage,
        products.length,
        userPreferences.disableAds,
    ]);

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
