import React, { useCallback, useContext, useMemo } from 'react';
import { DrawerContentOptions } from '@react-navigation/drawer';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    MainMenuContainer,
    LogoContainer,
    Logo,
    MenuItemContainer,
    MenuContent,
    MenuItemText,
    Icons,
    DrawerSection,
    LabelGroup,
    LabelContainer,
    Label,
} from './styles';

const DrawerMenu: React.FC<DrawerContentOptions> = (
    props: DrawerContentOptions
) => {
    const { navigation } = props;

    const { userPreferences } = useContext(PreferencesContext);

    const shouldShowMultiplesStores = useMemo(() => {
        if (!userPreferences.isUserPremium) {
            return true;
        }

        if (userPreferences.isUserPremium && userPreferences.multiplesStores) {
            return true;
        }

        return false;
    }, [userPreferences]);

    const navigateToAddProduct = useCallback(() => {
        navigation.navigate('AddProduct');
    }, [navigation]);

    const navigateToAllProducts = useCallback(() => {
        navigation.navigate('AllProducts');
    }, [navigation]);

    const navigateToCategories = useCallback(() => {
        navigation.navigate('ListCategory');
    }, [navigation]);

    const navigateToAllProductsByStore = useCallback(() => {
        navigation.navigate('StoreList');
    }, [navigation]);

    const navigateToExport = useCallback(() => {
        navigation.navigate('Export');
    }, [navigation]);

    const navigateToPRO = useCallback(() => {
        navigation.navigate('Pro');
    }, [navigation]);

    const handleNavigateToTeams = useCallback(() => {
        navigation.navigate('Teams');
    }, [navigation]);

    return (
        <Container>
            <MainMenuContainer>
                <LogoContainer>
                    <Logo />
                </LogoContainer>
                <DrawerSection>
                    <MenuItemContainer
                        onPress={() => navigation.navigate('Home')}
                    >
                        <MenuContent>
                            <Icons name="home-outline" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToHome}
                            </MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>

                    <MenuItemContainer onPress={navigateToAddProduct}>
                        <MenuContent>
                            <Icons name="add" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToAddProduct}
                            </MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>

                    <MenuItemContainer onPress={navigateToAllProducts}>
                        <MenuContent>
                            <Icons name="apps-outline" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToAllProducts}
                            </MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>

                    <MenuItemContainer
                        onPress={
                            userPreferences.isUserPremium
                                ? navigateToCategories
                                : navigateToPRO
                        }
                    >
                        <MenuContent>
                            <Icons name="file-tray-full-outline" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToCategories}
                            </MenuItemText>
                        </MenuContent>

                        <LabelGroup>
                            <LabelContainer>
                                <Label>{strings.Menu_Label_PRO}</Label>
                            </LabelContainer>
                        </LabelGroup>
                    </MenuItemContainer>

                    {shouldShowMultiplesStores && (
                        <MenuItemContainer
                            onPress={
                                userPreferences.isUserPremium
                                    ? navigateToAllProductsByStore
                                    : navigateToPRO
                            }
                        >
                            <MenuContent>
                                <Icons name="list-outline" />
                                <MenuItemText>
                                    {strings.Menu_Button_GoToStores}
                                </MenuItemText>
                            </MenuContent>

                            <LabelGroup>
                                <LabelContainer>
                                    <Label>{strings.Menu_Label_PRO}</Label>
                                </LabelContainer>
                            </LabelGroup>
                        </MenuItemContainer>
                    )}

                    <MenuItemContainer
                        onPress={
                            userPreferences.isUserPremium
                                ? navigateToExport
                                : navigateToPRO
                        }
                    >
                        <MenuContent>
                            <Icons name="download-outline" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToExport}
                            </MenuItemText>
                        </MenuContent>

                        <LabelGroup>
                            <LabelContainer>
                                <Label>{strings.Menu_Label_PRO}</Label>
                            </LabelContainer>
                        </LabelGroup>
                    </MenuItemContainer>

                    {!userPreferences.isUserPremium && (
                        <MenuItemContainer
                            onPress={() => navigation.navigate('Pro')}
                        >
                            <MenuContent>
                                <Icons name="analytics-outline" />
                                <MenuItemText>
                                    {strings.Menu_Button_GoToProPage}
                                </MenuItemText>
                            </MenuContent>
                        </MenuItemContainer>
                    )}
                </DrawerSection>
            </MainMenuContainer>

            <DrawerSection>
                <MenuItemContainer onPress={handleNavigateToTeams}>
                    <MenuContent>
                        <Icons name="people-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_GoToTeams}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                <MenuItemContainer
                    onPress={() => navigation.navigate('Settings')}
                >
                    <MenuContent>
                        <Icons name="settings-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_GoToSettings}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                <MenuItemContainer onPress={() => navigation.navigate('About')}>
                    <MenuContent>
                        <Icons name="help-circle-outline" />
                        <MenuItemText>
                            {strings.Menu_Button_GoToAbout}
                        </MenuItemText>
                    </MenuContent>
                </MenuItemContainer>

                {__DEV__ && (
                    <MenuItemContainer
                        onPress={() => navigation.navigate('Test')}
                    >
                        <MenuContent>
                            <Icons name="bug-outline" />
                            <MenuItemText>
                                {strings.Menu_Button_GoToTest}
                            </MenuItemText>
                        </MenuContent>
                    </MenuItemContainer>
                )}
            </DrawerSection>
        </Container>
    );
};

export default DrawerMenu;
