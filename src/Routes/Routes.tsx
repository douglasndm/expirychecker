import React, { useCallback, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import remoteConfig from '@react-native-firebase/remote-config';

import TabMenu from '@components/TabMenu';

import PreferencesContext from '~/Contexts/PreferencesContext';

import Home from '~/Views/Home';
import AddProduct from '~/Views/Product/Add';
import AddLote from '~/Views/Batch/Add';
import EditProduct from '~/Views/Product/Edit';
import EditLote from '~/Views/Batch/Edit';
import ProductDetails from '~/Views/Product/Details';
import Settings from '~/Views/Settings';
import About from '~/Views/About';
import ProSubscription from '~/Views/ProSubscription';
import Success from '~/Views/Success';
import PhotoView from '~/Views/PhotoView';

import AllProducts from '~/Views/Product/List';
import WeekView from '~/Views/Product/WeekView';

import BatchView from '~/Views/Batch/View';
import BatchDiscount from '~/Views/Batch/Discount';

import StoreList from '~/Views/Stores/List';
import StoreDetails from '~/Views/Stores/Details';
import StoreEdit from '~/Views/Stores/Edit';

import ListCategory from '~/Views/Category/List';
import CategoryView from '~/Views/Category/View';
import CategoryEdit from '~/Views/Category/Edit';

import BrandList from '~/Views/Brand/List';
import BrandView from '~/Views/Brand/View';
import BrandEdit from '~/Views/Brand/Edit';

import Export from '~/Views/Export';

import Teams from '~/Views/Informations/Teams';

import TrackingPermission from '~/Views/Permissions/AppleATT';

import Test from '~/Views/Test';

const Stack = createNativeStackNavigator<RoutesParams>();

const Routes: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [currentRoute, setCurrentRoute] = useState('Home');

    const enableTabBar = remoteConfig().getValue('enable_app_bar');

    const handleRouteChange = useCallback(navRoutes => {
        if (navRoutes) {
            const { routes } = navRoutes.data.state;

            setCurrentRoute(routes[routes.length - 1].name);
        }
    }, []);

    return (
        <>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                screenListeners={{ state: handleRouteChange }}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="AddProduct" component={AddProduct} />
                <Stack.Screen name="AllProducts" component={AllProducts} />
                <Stack.Screen name="WeekView" component={WeekView} />

                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen
                    name="ProductDetails"
                    component={ProductDetails}
                />
                <Stack.Screen name="StoreDetails" component={StoreDetails} />
                <Stack.Screen name="AddLote" component={AddLote} />
                <Stack.Screen name="EditProduct" component={EditProduct} />
                <Stack.Screen name="EditLote" component={EditLote} />
                <Stack.Screen name="Test" component={Test} />
                <Stack.Screen name="Pro" component={ProSubscription} />
                <Stack.Screen name="Success" component={Success} />
                <Stack.Screen name="PhotoView" component={PhotoView} />

                <Stack.Screen name="BatchView" component={BatchView} />
                <Stack.Screen name="BatchDiscount" component={BatchDiscount} />

                <Stack.Screen name="ListCategory" component={ListCategory} />
                <Stack.Screen name="CategoryView" component={CategoryView} />
                <Stack.Screen name="CategoryEdit" component={CategoryEdit} />

                <Stack.Screen name="StoreList" component={StoreList} />
                <Stack.Screen name="StoreEdit" component={StoreEdit} />

                <Stack.Screen name="BrandList" component={BrandList} />
                <Stack.Screen name="BrandView" component={BrandView} />
                <Stack.Screen name="BrandEdit" component={BrandEdit} />

                <Stack.Screen name="Export" component={Export} />
                <Stack.Screen name="Teams" component={Teams} />

                {Platform.OS === 'ios' && (
                    <Stack.Screen
                        name="TrackingPermission"
                        component={TrackingPermission}
                    />
                )}
            </Stack.Navigator>

            {userPreferences.isPRO && enableTabBar.asBoolean() === true && (
                <TabMenu currentRoute={currentRoute} enableMultiplesStores={userPreferences.multiplesStores} />
            )}
        </>
    );
};

export default Routes;
