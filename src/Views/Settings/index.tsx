import React, { useCallback, useContext } from 'react';
import { DefaultTheme } from 'styled-components/native';

import strings from '@expirychecker/Locales';

import Header from '@components/Header';

import DaysNext from '@views/Settings/Components/DaysNext';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Appearance from '@views/Settings/Components/Appearance';

import {
	Container,
	Content,
	SettingsContent,
	Category,
	CategoryTitle,
	CategoryOptions,
} from '@views/Settings/styles';

import Pro from './Components/Pro';
import Advanced from './Components/Advanced';
import Account from './Components/Account';

const Settings: React.FC = () => {
	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);

	const setSettingDaysToBeNext = useCallback(
		async (days: number) => {
			setUserPreferences({
				...userPreferences,
				howManyDaysToBeNextToExpire: days,
			});
		},
		[setUserPreferences, userPreferences]
	);

	const previousDaysToBeNext = String(
		userPreferences.howManyDaysToBeNextToExpire
	);

	const onThemeChoosen = useCallback(
		(theme: DefaultTheme) => {
			setUserPreferences({
				...userPreferences,
				appTheme: theme,
			});
		},
		[setUserPreferences, userPreferences]
	);

	return (
		<Container>
			<Header title={strings.View_Settings_PageTitle} noDrawer />
			<Content>
				<SettingsContent>
					<Category>
						<CategoryTitle>
							{strings.View_Settings_CategoryName_General}
						</CategoryTitle>

						<CategoryOptions>
							<DaysNext
								defaultValue={previousDaysToBeNext}
								onUpdate={setSettingDaysToBeNext}
							/>
						</CategoryOptions>
					</Category>

					<Appearance
						enablePROThemes={userPreferences.isPRO}
						onThemeChoosen={onThemeChoosen}
					/>

					{userPreferences.isPRO && <Pro />}

					<Advanced />

					{userPreferences.isPRO && <Account />}
				</SettingsContent>
			</Content>
		</Container>
	);
};

export default Settings;
