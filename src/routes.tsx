import React, { useState, useCallback, useContext, useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import remoteConfig from '@react-native-firebase/remote-config';
import { Drawer } from 'react-native-drawer-layout';

import DrawerContext from '@shared/Contexts/Drawer';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import TabMenu from '@components/TabMenu';

import DrawerMenu from '@expirychecker/Components/DrawerMenu';

import Home from '@expirychecker/Views/Home';
import AddProduct from '@expirychecker/Views/Product/Add';
import AddBatch from '@expirychecker/Views/Batch/Add';
import EditProduct from '@expirychecker/Views/Product/Edit';
import EditLote from '@expirychecker/Views/Batch/Edit';
import ProductDetails from '@expirychecker/Views/Product/Details';
import About from '@expirychecker/Views/About';
import Success from '@expirychecker/Views/Success';
import PhotoView from '@views/Product/PhotoView';

import BatchView from '@expirychecker/Views/Batch/View';
import BatchDiscount from '@expirychecker/Views/Batch/Discount';

import StoreList from '@expirychecker/Views/Stores/List';
import StoreDetails from '@expirychecker/Views/Stores/Details';
import StoreEdit from '@expirychecker/Views/Stores/Edit';

import ListCategory from '@expirychecker/Views/Category/List';
import CategoryView from '@expirychecker/Views/Category/View';
import CategoryEdit from '@expirychecker/Views/Category/Edit';

import BrandList from '@expirychecker/Views/Brand/List';
import BrandView from '@expirychecker/Views/Brand/View';
import BrandEdit from '@expirychecker/Views/Brand/Edit';

import Export from '@expirychecker/Views/Export';

import SubscriptionCancel from '@expirychecker/Views/Informations/Subscription/Cancel';

import Settings from '@expirychecker/Views/Settings';
import SettingsDeleteAll from '@expirychecker/Views/Settings/DeleteAll';

import Login from '@expirychecker/Views/Auth/Login';

import TrackingPermission from '@expirychecker/Views/Permissions/AppleATT';

import Test from '@expirychecker/Views/Test';

const Stack = createStackNavigator<RoutesParams>();

const StackNavigator: React.FC = () => {
	const [draweOpen, setDrawerOpen] = useState(false);

	const { userPreferences } = useContext(PreferencesContext);
	const enableTabBar = remoteConfig().getValue('enable_app_bar');

	const [currentRoute, setCurrentRoute] = useState('Home');

	const handleRouteChange = useCallback(navRoutes => {
		setDrawerOpen(false);

		if (navRoutes) {
			const { routes } = navRoutes.data.state;

			setCurrentRoute(routes[routes.length - 1].name);
		}
	}, []);

	const toggleDrawer = useCallback(() => {
		setDrawerOpen(prevState => !prevState);
	}, []);

	const contextValue = useMemo(
		() => ({ setDrawerOpen, toggleDrawer }),
		[setDrawerOpen, toggleDrawer]
	);

	return (
		<Drawer
			open={draweOpen}
			onOpen={() => setDrawerOpen(true)}
			onClose={() => setDrawerOpen(false)}
			renderDrawerContent={() => <DrawerMenu />}
		>
			<DrawerContext.Provider value={contextValue}>
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
					}}
					screenListeners={{ state: handleRouteChange }}
				>
					<Stack.Screen name="Home" component={Home} />
					<Stack.Screen name="AddProduct" component={AddProduct} />

					<Stack.Screen name="About" component={About} />
					<Stack.Screen
						name="ProductDetails"
						component={ProductDetails}
					/>
					<Stack.Screen
						name="StoreDetails"
						component={StoreDetails}
					/>
					<Stack.Screen name="AddBatch" component={AddBatch} />
					<Stack.Screen name="EditProduct" component={EditProduct} />
					<Stack.Screen name="EditLote" component={EditLote} />
					<Stack.Screen name="Test" component={Test} />
					<Stack.Screen name="Success" component={Success} />
					<Stack.Screen name="PhotoView" component={PhotoView} />

					<Stack.Screen name="BatchView" component={BatchView} />
					<Stack.Screen
						name="BatchDiscount"
						component={BatchDiscount}
					/>

					<Stack.Screen
						name="ListCategory"
						component={ListCategory}
					/>
					<Stack.Screen
						name="CategoryView"
						component={CategoryView}
					/>
					<Stack.Screen
						name="CategoryEdit"
						component={CategoryEdit}
					/>

					<Stack.Screen name="StoreList" component={StoreList} />
					<Stack.Screen name="StoreEdit" component={StoreEdit} />

					<Stack.Screen name="BrandList" component={BrandList} />
					<Stack.Screen name="BrandView" component={BrandView} />
					<Stack.Screen name="BrandEdit" component={BrandEdit} />

					<Stack.Screen name="Export" component={Export} />
					<Stack.Screen
						name="SubscriptionCancel"
						component={SubscriptionCancel}
					/>

					<Stack.Screen name="Settings" component={Settings} />
					<Stack.Screen
						name="DeleteAll"
						component={SettingsDeleteAll}
					/>

					<Stack.Screen name="Login" component={Login} />

					<Stack.Screen
						name="TrackingPermission"
						component={TrackingPermission}
					/>
				</Stack.Navigator>
				{userPreferences.isPRO && enableTabBar.asBoolean() === true && (
					<TabMenu
						currentRoute={currentRoute}
						enableMultiplesStores
					/>
				)}
			</DrawerContext.Provider>
		</Drawer>
	);
};

export default StackNavigator;
