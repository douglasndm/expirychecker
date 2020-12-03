import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../Views/Home';
import AddProduct from '../Views/AddProduct';
import AddLote from '../Views/AddLote';
import EditProduct from '../Views/EditProduct';
import EditLote from '../Views/EditLote';
import ProductDetails from '../Views/ProductDetails';
import AllProducts from '../Views/AllProducts';
import AllProductsByStore from '../Views/AllProductsByStore';
import StoreDetails from '../Views/StoreDetails';
import Settings from '../Views/Settings';
import About from '../Views/About';
import PremiumSubscription from '../Views/PremiumSubscription';
import Success from '../Views/Success';
import Migration from '../Views/Migration';

import Test from '../Views/Test';

const Stack = createStackNavigator();

const Routes: React.FC = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="AddProduct" component={AddProduct} />
            <Stack.Screen name="AllProducts" component={AllProducts} />
            <Stack.Screen
                name="AllProductsByStore"
                component={AllProductsByStore}
            />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
            <Stack.Screen name="StoreDetails" component={StoreDetails} />
            <Stack.Screen name="AddLote" component={AddLote} />
            <Stack.Screen name="EditProduct" component={EditProduct} />
            <Stack.Screen name="EditLote" component={EditLote} />
            <Stack.Screen name="Test" component={Test} />
            <Stack.Screen
                name="PremiumSubscription"
                component={PremiumSubscription}
            />
            <Stack.Screen name="Success" component={Success} />
            <Stack.Screen name="Migration" component={Migration} />
        </Stack.Navigator>
    );
};

export default Routes;
