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
import CodePush from 'react-native-code-push';

import '@expirychecker/Locales';

import Themes from '@shared/Themes';
import StatusBar from '@components/StatusBar';

import '@services/AppCheck';
import '@services/Firebase/InAppMessaging';
import '@expirychecker/Services/Sentry';
import '@expirychecker/Services/DeviceId';
import '@expirychecker/Services/BackgroundJobs';
import '@expirychecker/Services/Admob';
import '@expirychecker/Services/Analytics';
import '@expirychecker/Services/RemoteConfig';
import DeepLinking from '@expirychecker/Services/DeepLinking';

import './Functions/ProMode';
import './Functions/PushNotifications';
import ListContext from '@shared/Contexts/ListContext';
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
		enableNotifications: true,
		disableAds: false,
		allowRemoteImages: true,
	});
	const [currentList, setCurrentList] = useState(null);

	const loadInitialData = useCallback(async () => {
		const userPreferences = await getAllUserPreferences();

		setPreferences(userPreferences);
	}, []);

	type IState =
		| Readonly<{
				key: string;
				index: number;
				routeNames: string[];
				history?: unknown[] | undefined;
				routes: NavigationRoute<ParamListBase, string>[];
				type: string;
				stale: false;
		  }>
		| undefined;

	const handleOnScreenChange = useCallback(
		async (state: IState) => {
			if (!state) return;

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

	const list = useMemo(() => {
		return {
			currentList,
			setCurrentList,
		};
	}, [currentList]);

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
							<ListContext.Provider value={list}>
								<Routes />
							</ListContext.Provider>
							<AskReview />
						</NavigationContainer>
						<FlashMessage duration={7000} statusBarHeight={50} />
					</Portal>
				</PaperProvider>
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};

export default CodePush(App);
