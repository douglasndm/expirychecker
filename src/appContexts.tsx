import React, {
	useState,
	useMemo,
	useCallback,
	useEffect,
	ReactNode,
} from 'react';
import { ThemeProvider } from 'styled-components/native';

import AppContext from '@shared/Contexts/App';
import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { defaultPreferences } from '@expirychecker/Services/Preferences';

import { getAllUserPreferences } from '@expirychecker/Functions/UserPreferences';

interface AppContextProps {
	children: ReactNode;
}

const appContext: React.FC<AppContextProps> = ({ children }) => {
	const [app, setApp] = useState<
		'expiry_tracker' | 'expiry_teams' | undefined
	>('expiry_tracker');
	const [preferences, setPreferences] = useState(defaultPreferences);

	const appContextValue = useMemo(() => ({ app, setApp }), [app, setApp]);

	const prefesValues = useMemo(
		() => ({
			userPreferences: preferences,
			setUserPreferences: setPreferences,
		}),
		[preferences, setPreferences]
	);

	const loadInitialData = useCallback(async () => {
		const userPreferences = await getAllUserPreferences();

		setPreferences(userPreferences);
	}, []);

	useEffect(() => {
		loadInitialData();
	}, [loadInitialData]);

	return (
		<AppContext.Provider value={appContextValue}>
			<PreferencesContext.Provider value={prefesValues}>
				<ThemeProvider theme={preferences.appTheme}>
					{children}
				</ThemeProvider>
			</PreferencesContext.Provider>
		</AppContext.Provider>
	);
};

export default appContext;
