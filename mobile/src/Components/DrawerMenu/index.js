import React from 'react';
import { View } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Logo from '../../Assets/Logo.png';

import { MenuHeader, LogoImage } from './styles';

export function DrawerMenu(props) {
    const { navigation } = props;

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View>
                    <MenuHeader>
                        <LogoImage resizeMode="center" source={Logo} />
                    </MenuHeader>

                    <Drawer.Section>
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="home-outline"
                                    color="black"
                                    size={22}
                                />
                            )}
                            label="Início"
                            onPress={() => navigation.navigate('Home')}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons name="add" color="black" size={22} />
                            )}
                            label="Adicionar produto"
                            onPress={() => navigation.navigate('AddProduct')}
                        />
                        <DrawerItem
                            icon={() => (
                                <Ionicons
                                    name="apps-outline"
                                    color="black"
                                    size={22}
                                />
                            )}
                            label="Todos os produtos"
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
                            color="black"
                            size={22}
                        />
                    )}
                    label="Configurações"
                    onPress={() => navigation.navigate('Settings')}
                />
                <DrawerItem
                    icon={() => (
                        <Ionicons
                            name="help-circle-outline"
                            color="black"
                            size={22}
                        />
                    )}
                    label="Sobre"
                    onPress={() => navigation.navigate('About')}
                />

                {__DEV__ ? (
                    <DrawerItem
                        icon={() => (
                            <Ionicons
                                name="bug-outline"
                                color="black"
                                size={22}
                            />
                        )}
                        label="Test"
                        onPress={() => navigation.navigate('Test')}
                    />
                ) : null}
            </Drawer.Section>
        </View>
    );
}
