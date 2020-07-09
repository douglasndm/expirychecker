import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from './Views/Home';
import AddProduct from './Views/AddProduct';

const Drawer = createDrawerNavigator();

export default () => {
    return (
        <Drawer.Navigator>
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
        </Drawer.Navigator>
    );
};
