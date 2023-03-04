import React, { useState, useEffect, useCallback, useContext } from 'react';
import { getLocales } from 'react-native-localize';
import { Switch } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import Loading from '@components/Loading';
import Header from '@components/Header';

import DaysNext from '@views/Settings/Components/DaysNext';

import {
	setEnableMultipleStoresMode,
	setStoreFirstPage,
	setAutoComplete,
} from '@expirychecker/Functions/Settings';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import Appearance from '@views/Settings/Components/Appearance';

import {
	Container,
	Content,
	SettingsContent,
	Category,
	CategoryTitle,
	CategoryOptions,
	SettingContainer,
	SettingDescription,
} from '@views/Settings/styles';

import Pro from './Components/Pro';

const Settings: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [autoCompleteState, setAutoCompleteState] = useState<boolean>(false);
	const [multipleStoresState, setMultipleStoresState] =
		useState<boolean>(false);
	const [storeFirstPageState, setStoreFirstPageState] =
		useState<boolean>(false);

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
	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			setAutoCompleteState(userPreferences.autoComplete);
			setMultipleStoresState(userPreferences.multiplesStores);
			setStoreFirstPageState(userPreferences.storesFirstPage);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsLoading(false);
		}
	}, [
		userPreferences.autoComplete,
		userPreferences.multiplesStores,
		userPreferences.storesFirstPage,
	]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleUpdateAutoComplete = useCallback(async () => {
		const newValue = !autoCompleteState;
		setAutoCompleteState(newValue);

		await setAutoComplete(newValue);

		setUserPreferences({
			...userPreferences,
			autoComplete: newValue,
		});
	}, [autoCompleteState, setUserPreferences, userPreferences]);

	const handleMultiStoresEnableSwitch = useCallback(async () => {
		const newValue = !multipleStoresState;
		setMultipleStoresState(newValue);

		await setEnableMultipleStoresMode(newValue);

		setUserPreferences({
			...userPreferences,
			multiplesStores: newValue,
		});
	}, [multipleStoresState, setUserPreferences, userPreferences]);

	const handleStoreFirstPageSwitch = useCallback(async () => {
		const newValue = !storeFirstPageState;
		setStoreFirstPageState(newValue);
		await setStoreFirstPage(newValue);

		setUserPreferences({
			...userPreferences,
			storesFirstPage: newValue,
		});
	}, [setUserPreferences, storeFirstPageState, userPreferences]);

	const onThemeChoosen = useCallback(
		(theme: DefaultTheme) => {
			setUserPreferences({
				...userPreferences,
				appTheme: theme,
			});
		},
		[setUserPreferences, userPreferences]
	);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Content>
				<Header title={strings.View_Settings_PageTitle} noDrawer />

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

							{userPreferences.isPRO && (
								<>
									{getLocales()[0].languageCode === 'pt' && (
										<SettingContainer>
											<SettingDescription>
												Autocompletar automacatimente
											</SettingDescription>
											<Switch
												value={autoCompleteState}
												onValueChange={
													handleUpdateAutoComplete
												}
												color={
													userPreferences.appTheme
														.colors.accent
												}
											/>
										</SettingContainer>
									)}

									<SettingContainer>
										<SettingDescription>
											{
												strings.View_Settings_SettingName_EnableMultiplesStores
											}
										</SettingDescription>
										<Switch
											value={multipleStoresState}
											onValueChange={
												handleMultiStoresEnableSwitch
											}
											color={
												userPreferences.appTheme.colors
													.accent
											}
										/>
									</SettingContainer>

									{multipleStoresState && (
										<SettingContainer>
											<SettingDescription>
												{
													strings.View_Settings_SettingName_EnableStoresFirstPage
												}
											</SettingDescription>
											<Switch
												value={storeFirstPageState}
												onValueChange={
													handleStoreFirstPageSwitch
												}
												color={
													userPreferences.appTheme
														.colors.accent
												}
											/>
										</SettingContainer>
									)}
								</>
							)}
						</CategoryOptions>
					</Category>

					<Appearance
						enablePROThemes={userPreferences.isPRO}
						onThemeChoosen={onThemeChoosen}
					/>

					<Pro />
				</SettingsContent>
			</Content>
		</Container>
	);
};

export default Settings;
