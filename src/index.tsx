import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LogBox } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import {
	NavigationContainer,
	getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import FlashMessage from 'react-native-flash-message';
import { enableScreens } from 'react-native-screens';

import Themes from '@shared/Themes';

import StatusBar from '@components/StatusBar';

import './Locales';

import '@services/AppCheck';
import '@services/Firebase/InAppMessaging';
import './Services/Adjust';
import './Services/DeviceId';
import './Services/BackgroundJobs';
import './Services/Admob';
import './Services/Analytics';
import './Services/RemoteConfig';
import DeepLinking from './Services/DeepLinking';

import './Functions/ProMode';
import './Functions/PushNotifications';
import { getAllUserPreferences } from './Functions/UserPreferences';

import Routes from './Routes/DrawerContainer';

import PreferencesContext from './Contexts/PreferencesContext';

import AskReview from './Components/AskReview';
import AppOpen from './Components/Ads/AppOpen';

LogBox.ignoreLogs(['new NativeEventEmitter', 'EventEmitter.removeListener']); // Ignore log notification by message

enableScreens(true);

const App: React.FC = () => {
	const [previousRoute, setPreviousRoute] = useState('Home');

	const [preferences, setPreferences] = useState({
		howManyDaysToBeNextToExpire: 30,
		autoComplete: false,
		isPRO: false,
		appTheme: Themes.Light,
		multiplesStores: false,
		storesFirstPage: false,
		enableNotifications: true,
		disableAds: false,
		allowRemoteImages: true,
	});

	const loadInitialData = useCallback(async () => {
		const userPreferences = await getAllUserPreferences();

		setPreferences(userPreferences);
	}, []);

	const handleOnScreenChange = useCallback(
		async state => {
			const route = state.routes[0] || 'undefined';
			const focusedRouteName = getFocusedRouteNameFromRoute(route);

			if (focusedRouteName) {
				if (previousRoute !== focusedRouteName) {
					setPreviousRoute(focusedRouteName);

					if (!__DEV__) {
						await Analyticts().logScreenView({
							screen_name: focusedRouteName,
							screen_class: focusedRouteName,
						});
					}
				}
			}
		},
		[previousRoute]
	);
	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	const prefes = useMemo(
		() => ({
			userPreferences: preferences,
			setUserPreferences: setPreferences,
		}),
		[preferences]
	);

	return (
		<PreferencesContext.Provider value={prefes}>
			<ThemeProvider theme={preferences.appTheme}>
				<PaperProvider>
					<Portal>
						<NavigationContainer
							linking={DeepLinking}
							onStateChange={handleOnScreenChange}
						>
							<AppOpen />
							<StatusBar />
							<Routes />
							<AskReview />
						</NavigationContainer>
						<FlashMessage duration={7000} statusBarHeight={50} />
					</Portal>
				</PaperProvider>
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};

export default App;
