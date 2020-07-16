import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerMenu } from '../Components/DrawerMenu';

import Routes from './Routes';

const Drawer = createDrawerNavigator();

export default () => {
    return (
        <Drawer.Navigator
            drawerType="slide"
            openByDefault={false}
            keyboardDismissMode="on-drag"
            drawerContent={(props) => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="HomePage" component={Routes} />
        </Drawer.Navigator>
    );
};
