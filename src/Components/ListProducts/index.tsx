import React, { useCallback, useContext, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { deleteManyProducts } from '~/Utils/Products';

import ProductItem from './ProductContainer';
import GenericButton from '../Button';

import {
    Container,
    ActionButtonsContainer,
    ProductContainer,
    SelectButtonContainer,
    SelectButton,
    SelectIcon,
    ButtonPaper,
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

    const [selectedProds, setSelectedProds] = useState<Array<number>>([]);
    const [selectMode, setSelectMode] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const { userPreferences } = useContext(PreferencesContext);

    const handleNavigateToAllProducts = useCallback(() => {
        navigate('AllProducts');
    }, [navigate]);

    const handleNavigateAddProduct = useCallback(() => {
        navigate('AddProduct');
    }, [navigate]);

    const switchSelectedItem = useCallback(
        (productId: number) => {
            const isChecked = selectedProds.find(id => id === productId);

            if (!isChecked) {
                const prodsIds = [...selectedProds, productId];

                setSelectedProds(prodsIds);
                return;
            }

            const newSelected = selectedProds.filter(id => id !== productId);
            setSelectedProds(newSelected);
        },
        [selectedProds]
    );

    const handleEnableSelectMode = useCallback(() => {
        if (userPreferences.isUserPremium) setSelectMode(true);
    }, [userPreferences.isUserPremium]);

    const handleDisableSelectMode = useCallback(() => {
        setSelectMode(false);
    }, []);

    const ListHeader = useCallback(() => {
        return (
            <View>
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
    }, [products.length]);

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

    const renderComponent = useCallback(
        ({ item }) => {
            const product: IProduct = item as IProduct;

            const isChecked = selectedProds.find(id => id === product.id);

            return (
                <ProductContainer onLongPress={handleEnableSelectMode}>
                    {selectMode && (
                        <SelectButtonContainer>
                            <SelectButton
                                onPress={() => switchSelectedItem(product.id)}
                            >
                                {isChecked ? (
                                    <SelectIcon name="checkmark-circle-outline" />
                                ) : (
                                    <SelectIcon name="ellipse-outline" />
                                )}
                            </SelectButton>
                        </SelectButtonContainer>
                    )}
                    <ProductItem
                        product={product}
                        handleEnableSelect={handleEnableSelectMode}
                    />
                </ProductContainer>
            );
        },
        [handleEnableSelectMode, selectMode, selectedProds, switchSelectedItem]
    );

    const handleSwitchDeleteModal = useCallback(() => {
        setDeleteModal(!deleteModal);
    }, [deleteModal]);

    const handleDeleteMany = useCallback(async () => {
        if (selectedProds.length <= 0) {
            handleDisableSelectMode();
            setDeleteModal(false);
            return;
        }
        try {
            await deleteManyProducts({ productsIds: selectedProds });

            if (onRefresh) onRefresh();

            showMessage({
                message:
                    strings.ListProductsComponent_ProductsDeleted_Notification,
                type: 'info',
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        }
    }, [handleDisableSelectMode, onRefresh, selectedProds]);

    return (
        <Container>
            {selectMode && userPreferences.isUserPremium && (
                <ActionButtonsContainer>
                    <ButtonPaper
                        icon={() => <Icons name="trash-outline" />}
                        onPress={handleSwitchDeleteModal}
                    >
                        {
                            strings.ListProductsComponent_DeleteProducts_ActionBar_DeleteSelected
                        }
                    </ButtonPaper>

                    <ButtonPaper
                        icon={() => <Icons name="exit-outline" />}
                        onPress={handleDisableSelectMode}
                    >
                        {
                            strings.ListProductsComponent_DeleteProducts_ActionBar_Cancel
                        }
                    </ButtonPaper>
                </ActionButtonsContainer>
            )}
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

            <Dialog.Container
                visible={deleteModal}
                onBackdropPress={handleSwitchDeleteModal}
            >
                <Dialog.Title>
                    {strings.ListProductsComponent_DeleteProducts_Modal_Title}
                </Dialog.Title>
                <Dialog.Description>
                    {
                        strings.ListProductsComponent_DeleteProducts_Modal_Description
                    }
                </Dialog.Description>
                <Dialog.Button
                    label={
                        strings.ListProductsComponent_DeleteProducts_Modal_Button_Keep
                    }
                    onPress={handleSwitchDeleteModal}
                />
                <Dialog.Button
                    label={
                        strings.ListProductsComponent_DeleteProducts_Modal_Button_Delete
                    }
                    color="red"
                    onPress={handleDeleteMany}
                />
            </Dialog.Container>
        </Container>
    );
};

export default ListProducts;
