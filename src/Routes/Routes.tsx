import React, { useCallback, useContext, useState } from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import remoteConfig from '@react-native-firebase/remote-config';

import TabMenu from '@components/TabMenu';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Home from '@expirychecker/Views/Home';
import AddProduct from '@expirychecker/Views/Product/Add';
import AddBatch from '@expirychecker/Views/Batch/Add';
import EditProduct from '@expirychecker/Views/Product/Edit';
import EditLote from '@expirychecker/Views/Batch/Edit';
import ProductDetails from '@expirychecker/Views/Product/Details';
import Settings from '@expirychecker/Views/Settings';
import About from '@expirychecker/Views/About';
import ProSubscription from '@expirychecker/Views/ProSubscription';
import Success from '@expirychecker/Views/Success';
import PhotoView from '@expirychecker/Views/PhotoView';

import AllProducts from '@expirychecker/Views/Product/List';
import WeekView from '@expirychecker/Views/Product/WeekView';

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

import TrackingPermission from '@expirychecker/Views/Permissions/AppleATT';

import Test from '@expirychecker/Views/Test';

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
				<Stack.Screen name="AddBatch" component={AddBatch} />
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
				<Stack.Screen
					name="SubscriptionCancel"
					component={SubscriptionCancel}
				/>

				{Platform.OS === 'ios' && (
					<Stack.Screen
						name="TrackingPermission"
						component={TrackingPermission}
					/>
				)}
			</Stack.Navigator>

			{userPreferences.isPRO && enableTabBar.asBoolean() === true && (
				<TabMenu
					currentRoute={currentRoute}
					enableMultiplesStores={userPreferences.multiplesStores}
				/>
			)}
		</>
	);
};

export default Routes;
