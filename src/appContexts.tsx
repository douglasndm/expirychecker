import React, {
	useState,
	useMemo,
	useCallback,
	useEffect,
	ReactNode,
} from 'react';
import { ThemeProvider } from 'styled-components/native';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { defaultPreferences } from '@expirychecker/Services/Preferences';

import { getAllUserPreferences } from '@expirychecker/Functions/UserPreferences';

interface AppContextProps {
	children: ReactNode;
}

const appContext: React.FC<AppContextProps> = ({ children }) => {
	const [preferences, setPreferences] = useState(defaultPreferences);

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
		<PreferencesContext.Provider value={prefesValues}>
			<ThemeProvider theme={preferences.appTheme}>
				{children}
			</ThemeProvider>
		</PreferencesContext.Provider>
	);
};

export default appContext;
