import React, { useState, useCallback, useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import remoteConfig from '@react-native-firebase/remote-config';

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

import AllProducts from '@expirychecker/Views/Product/List';

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

import Teams from '@expirychecker/Views/Informations/Teams';

import SubscriptionCancel from '@expirychecker/Views/Informations/Subscription/Cancel';

import Settings from '@expirychecker/Views/Settings';
import SettingsDeleteAll from '@expirychecker/Views/Settings/DeleteAll';

import TrackingPermission from '@expirychecker/Views/Permissions/AppleATT';

import Test from '@expirychecker/Views/Test';

const Drawer = createDrawerNavigator();

const DrawerContainer: React.FC = () => {
	const { userPreferences } = useContext(PreferencesContext);

	const [currentRoute, setCurrentRoute] = useState('Home');

	const enableTabBar = remoteConfig().getValue('enable_app_bar');

	const handleRouteChange = useCallback(navRoutes => {
		if (navRoutes) {
			const { routes, history } = navRoutes.data.state;

			const routeInHistory = history[history.length - 1];
			const route = routes.find(r => r.key === routeInHistory.key);

			if (route && route.name) {
				setCurrentRoute(route.name);
			} else {
				setCurrentRoute('NoMenu');
			}
		}
	}, []);

	return (
		<>
			<Drawer.Navigator
				defaultStatus="closed"
				screenOptions={{
					headerShown: false,
				}}
				screenListeners={{ state: handleRouteChange }}
				drawerContent={props => <DrawerMenu {...props} />}
			>
				<Drawer.Screen name="Home" component={Home} />
				<Drawer.Screen name="AddProduct" component={AddProduct} />
				<Drawer.Screen name="AllProducts" component={AllProducts} />

				<Drawer.Screen
					name="ProductDetails"
					component={ProductDetails}
				/>
				<Drawer.Screen name="StoreDetails" component={StoreDetails} />
				<Drawer.Screen name="AddBatch" component={AddBatch} />
				<Drawer.Screen name="EditProduct" component={EditProduct} />
				<Drawer.Screen name="EditLote" component={EditLote} />
				<Drawer.Screen name="Test" component={Test} />
				<Drawer.Screen name="About" component={About} />

				<Drawer.Screen name="Success" component={Success} />
				<Drawer.Screen name="PhotoView" component={PhotoView} />

				<Drawer.Screen name="BatchView" component={BatchView} />
				<Drawer.Screen name="BatchDiscount" component={BatchDiscount} />

				<Drawer.Screen name="ListCategory" component={ListCategory} />
				<Drawer.Screen name="CategoryView" component={CategoryView} />
				<Drawer.Screen name="CategoryEdit" component={CategoryEdit} />

				<Drawer.Screen name="StoreList" component={StoreList} />
				<Drawer.Screen name="StoreEdit" component={StoreEdit} />

				<Drawer.Screen name="BrandList" component={BrandList} />
				<Drawer.Screen name="BrandView" component={BrandView} />
				<Drawer.Screen name="BrandEdit" component={BrandEdit} />

				<Drawer.Screen name="Export" component={Export} />
				<Drawer.Screen name="Teams" component={Teams} />
				<Drawer.Screen
					name="SubscriptionCancel"
					component={SubscriptionCancel}
				/>

				<Drawer.Screen name="Settings" component={Settings} />
				<Drawer.Screen name="DeleteAll" component={SettingsDeleteAll} />

				<Drawer.Screen
					name="TrackingPermission"
					component={TrackingPermission}
				/>
			</Drawer.Navigator>
			{userPreferences.isPRO && enableTabBar.asBoolean() === true && (
				<TabMenu
					currentRoute={currentRoute}
					enableMultiplesStores={userPreferences.multiplesStores}
				/>
			)}
		</>
	);
};

export default DrawerContainer;
