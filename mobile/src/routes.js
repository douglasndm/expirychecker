import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerMenu } from './Components/DrawerMenu';

import Home from './Views/Home';
import AddProduct from './Views/AddProduct';
import AddLote from './Views/AddLote';
import ProductDetails from './Views/ProductDetails';
import AllProducts from './Views/AllProducts';
import Settings from './Views/Settings';
import About from './Views/About';

const Drawer = createDrawerNavigator();

export default () => {
    return (
        <Drawer.Navigator
            openByDefault={false}
            keyboardDismissMode="on-drag"
            drawerContent={(props) => <DrawerMenu {...props} />}
        >
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{ title: 'Início' }}
            />
            <Drawer.Screen
                name="AddProduct"
                component={AddProduct}
                options={{ title: 'Adicionar produto' }}
            />
            <Drawer.Screen
                name="AllProducts"
                component={AllProducts}
                options={{ title: 'Todos os produtos' }}
            />
            <Drawer.Screen
                name="Settings"
                component={Settings}
                options={{ title: 'Configurações' }}
            />
            <Drawer.Screen
                name="About"
                component={About}
                options={{ title: 'Sobre' }}
            />

            <Drawer.Screen
                name="ProductDetails"
                component={ProductDetails}
                options={{ title: 'Detalhes do produto' }}
            />

            <Drawer.Screen
                name="AddLote"
                component={AddLote}
                options={{ title: 'Adicionar Lote' }}
            />
        </Drawer.Navigator>
    );
};
