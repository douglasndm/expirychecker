import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer, useTheme } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Logo from '../../Assets/Logo.png';

import { MenuHeader, LogoImage } from './styles';

export function DrawerMenu(props) {
    const { navigation } = props;
    const theme = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <DrawerContentScrollView {...props}>
                <View>
                    <MenuHeader
                        style={{ backgroundColor: theme.colors.accent }}
                    >
                        <LogoImage resizeMode="center" source={Logo} />
                    </MenuHeader>

                    <Drawer.Section>
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="home-outline"
                                    color={theme.colors.text}
                                    size={22}
                                />
                            )}
                            label="Início"
                            labelStyle={{ color: theme.colors.text }}
                            onPress={() => navigation.navigate('Home')}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="add"
                                    color={theme.colors.text}
                                    size={22}
                                />
                            )}
                            label="Adicionar produto"
                            labelStyle={{ color: theme.colors.text }}
                            onPress={() => navigation.navigate('AddProduct')}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="apps-outline"
                                    color={theme.colors.text}
                                    size={22}
                                />
                            )}
                            label="Todos os produtos"
                            labelStyle={{ color: theme.colors.text }}
                            onPress={() => navigation.navigate('AllProducts')}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section>
                <DrawerItem
                    icon={() => (
                        <Ionicons
                            name="settings-outline"
                            color={theme.colors.text}
                            size={22}
                        />
                    )}
                    label="Configurações"
                    labelStyle={{ color: theme.colors.text }}
                    onPress={() => navigation.navigate('Settings')}
                />
                <DrawerItem
                    icon={() => (
                        <Ionicons
                            name="help-circle-outline"
                            color={theme.colors.text}
                            size={22}
                        />
                    )}
                    label="Sobre"
                    labelStyle={{ color: theme.colors.text }}
                    onPress={() => navigation.navigate('About')}
                />

                {__DEV__ ? (
                    <DrawerItem
                        icon={() => (
                            <Ionicons
                                name="bug-outline"
                                color={theme.colors.text}
                                size={22}
                            />
                        )}
                        label="Test"
                        labelStyle={{ color: theme.colors.text }}
                        onPress={() => navigation.navigate('Test')}
                    />
                ) : null}
            </Drawer.Section>
        </View>
    );
}
