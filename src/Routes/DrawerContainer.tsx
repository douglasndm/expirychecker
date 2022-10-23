import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerMenu from '../Components/DrawerMenu';

import Routes from './Routes';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
    return (
        <Drawer.Navigator
            defaultStatus="closed"
            screenOptions={{ headerShown: false }}
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="HomePage" component={Routes} />
        </Drawer.Navigator>
    );
};

export default DrawerContainer;
