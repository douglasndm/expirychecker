import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components/native';
import {
	NavigationContainer,
	ParamListBase,
	getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import Analyticts from '@react-native-firebase/analytics';
import FlashMessage from 'react-native-flash-message';
import { enableScreens } from 'react-native-screens';
import CodePush from 'react-native-code-push';

import '@expirychecker/Locales';

import StatusBar from '@components/StatusBar';
import AskReview from '@components/AskReview';

import { Bugsnag } from '@services/Bugsnag';
import '@services/Firebase/AppCheck';
import '@services/Firebase/InAppMessaging';

import '@expirychecker/Services/DeviceId';
import '@expirychecker/Services/BackgroundJobs';
import '@expirychecker/Services/Admob';
import '@expirychecker/Services/Analytics';
import '@expirychecker/Services/RemoteConfig';
import DeepLinking from '@expirychecker/Services/DeepLinking';
import { defaultPreferences } from '@expirychecker/Services/Preferences';

import './Functions/ProMode';
import './Functions/PushNotifications';

import AppContext from '@shared/Contexts/App';
import ListContext from '@shared/Contexts/ListContext';

import { AuthProvider } from '@teams/Contexts/AuthContext';
import { TeamProvider } from '@teams/Contexts/TeamContext';

import navigationRef from '@teams/References/Navigation';

import RenderError from '@views/Information/Errors/Render';

import Routes from '@expirychecker/routes';
import RoutesTeams from '@teams/routes';

import Dashboard from '@views/Dashboard';

import { getAllUserPreferences } from './Functions/UserPreferences';

import PreferencesContext from './Contexts/PreferencesContext';

import AppOpen from './Components/Ads/AppOpen';

enableScreens(true);

const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
const { createNavigationContainer } = Bugsnag.getPlugin('reactNavigation');
// The returned BugsnagNavigationContainer has exactly the same usage
// except now it tracks route information to send with your error reports
const BugsnagNavigationContainer =
	createNavigationContainer(NavigationContainer);

const App: React.FC = () => {
	const [app, setApp] = useState<
		'expiry_tracker' | 'expiry_teams' | undefined
	>('expiry_teams');
	const [previousRoute, setPreviousRoute] = useState('Home');

	const [preferences, setPreferences] = useState(defaultPreferences);
	const prefesValues = React.useMemo(
		() => ({
			userPreferences: preferences,
			setUserPreferences: setPreferences,
		}),
		[preferences, setPreferences]
	);

	const [currentList, setCurrentList] = useState<React.RefObject<
		FlatList<IProduct>
	> | null>(null);

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

	const list = useMemo(() => {
		return {
			currentList,
			setCurrentList,
		};
	}, [currentList]);

	const appContextValue = useMemo(() => ({ app, setApp }), [app, setApp]);

	return (
		<BugsnagNavigationContainer
			ref={navigationRef.setTopLevelNavigator}
			linking={DeepLinking}
			onStateChange={handleOnScreenChange}
		>
			<ErrorBoundary FallbackComponent={RenderError}>
				<AppContext.Provider value={appContextValue}>
					<PreferencesContext.Provider value={prefesValues}>
						<ThemeProvider theme={preferences.appTheme}>
							<PaperProvider>
								<Portal>
									{!app ? (
										<Dashboard />
									) : (
										<AuthProvider>
											<TeamProvider>
												<StatusBar />
												<AppOpen />
												<ListContext.Provider
													value={list}
												>
													{app === 'expiry_teams' ? (
														<RoutesTeams />
													) : (
														<Routes />
													)}
												</ListContext.Provider>
												<AskReview />
												<FlashMessage
													duration={7000}
													statusBarHeight={50}
												/>
											</TeamProvider>
										</AuthProvider>
									)}
								</Portal>
							</PaperProvider>
						</ThemeProvider>
					</PreferencesContext.Provider>
				</AppContext.Provider>
			</ErrorBoundary>
		</BugsnagNavigationContainer>
	);
};

export default CodePush(App);
