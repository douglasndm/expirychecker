import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../Views/Home';
import AddProduct from '../Views/AddProduct';
import AddLote from '../Views/AddLote';
import EditLote from '../Views/EditLote';
import ProductDetails from '../Views/ProductDetails';
import AllProducts from '../Views/AllProducts';
import Settings from '../Views/Settings';
import About from '../Views/About';

import Test from '../Views/Test';

const Stack = createStackNavigator();

export default () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="AllProducts" component={AllProducts} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="AddLote" component={AddLote} />
            <Stack.Screen name="EditLote" component={EditLote} />
            <Stack.Screen name="Test" component={Test} />
        </Stack.Navigator>
    );
};
