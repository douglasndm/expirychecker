import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
    DrawerContentOptions,
    DrawerContentScrollView,
} from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import { useTheme } from 'styled-components';

import { IsPlayStoreIsAvailable } from '../../Functions/Premium';
import { getMultipleStores } from '../../Functions/Settings';

import Logo from '../../Assets/Logo.png';

import { Container, MenuHeader, LogoImage, MenuItem, Icons } from './styles';

const DrawerMenu: React.FC<DrawerContentOptions> = (
    props: DrawerContentOptions
) => {
    const { navigation } = props;
    const theme = useTheme();

    const [playAvailable, setPlayAvailable] = useState(false);
    const [multipleStores, setMultipleStores] = useState(false);

    useEffect(() => {
        getMultipleStores().then((response) => {
            setMultipleStores(response);
        });

        async function getDatas() {
            const result = await IsPlayStoreIsAvailable();

            setPlayAvailable(result);
        }

        getDatas();
    }, []);

    return (
        <Container>
            <DrawerContentScrollView {...props}>
                <View>
                    <MenuHeader>
                        <LogoImage resizeMode="center" source={Logo} />
                    </MenuHeader>

                    <Drawer.Section>
                        <MenuItem
                            icon={() => <Icons name="home-outline" size={22} />}
                            label="Início"
                            onPress={() => navigation.navigate('Home')}
                        />
                        <MenuItem
                            icon={() => (
                                <Icons
                                    name="add"
                                    color={theme.colors.text}
                                    size={22}
                                />
                            )}
                            label="Adicionar produto"
                            onPress={() => navigation.navigate('AddProduct')}
                        />
                        <MenuItem
                            icon={() => <Icons name="apps-outline" size={22} />}
                            label="Todos os produtos"
                            onPress={() => navigation.navigate('AllProducts')}
                        />

                        {multipleStores && (
                            <MenuItem
                                icon={() => (
                                    <Icons name="list-outline" size={22} />
                                )}
                                label="Produtos por loja"
                                onPress={() =>
                                    navigation.navigate('AllProductsByStore')
                                }
                            />
                        )}

                        {playAvailable && (
                            <MenuItem
                                icon={() => (
                                    <Icons name="analytics-outline" size={22} />
                                )}
                                label="Seja Premium"
                                onPress={() => {
                                    navigation.navigate('PremiumSubscription');
                                }}
                            />
                        )}
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>

            <Drawer.Section>
                <MenuItem
                    icon={() => <Icons name="settings-outline" size={22} />}
                    label="Configurações"
                    onPress={() => navigation.navigate('Settings')}
                />
                <MenuItem
                    icon={() => <Icons name="help-circle-outline" size={22} />}
                    label="Sobre"
                    onPress={() => navigation.navigate('About')}
                />

                {__DEV__ && (
                    <MenuItem
                        icon={() => <Icons name="bug-outline" size={22} />}
                        label="Test"
                        onPress={() => navigation.navigate('Test')}
                    />
                )}
            </Drawer.Section>
        </Container>
    );
};

export default DrawerMenu;
