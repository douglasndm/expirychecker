import React, { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNetInfo } from '@react-native-community/netinfo';
import remoteConfig from '@react-native-firebase/remote-config';

import strings from '@expirychecker/Locales';

import { useApp } from '@shared/Contexts/App';

import { captureException } from '@shared/Services/ExceptionsHandler';

import { setDefaultApp } from '@expirychecker/Utils/Settings/SetSettings';

import Logo from '@components/Logo';
import {
	Container,
	MainMenuContainer,
	LogoContainer,
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	DrawerSection,
} from '@components/Menu/Drawer/styles';
import PROItems from './PRO';

const DrawerMenu: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { setApp } = useApp();

	const { isInternetReachable } = useNetInfo();

	const remoteEnableTeams = remoteConfig().getValue('enable_teams');

	const showTeams = useMemo(() => {
		if (__DEV__) {
			return true;
		}
		return remoteEnableTeams.asBoolean() && isInternetReachable;
	}, [isInternetReachable, remoteEnableTeams]);

	const windowHeight = useWindowDimensions().height;

	const navigateHome = useCallback(() => {
		navigate('Home', {});
	}, [navigate]);

	const navigateToAddProduct = useCallback(() => {
		navigate('AddProduct', {});
	}, [navigate]);

	const handleNavigateToSettings = useCallback(() => {
		navigate('Settings');
	}, [navigate]);

	const handleNavigateToAbout = useCallback(() => {
		navigate('About');
	}, [navigate]);

	const handleNavigateToTest = useCallback(() => {
		navigate('Test');
	}, [navigate]);

	const handleSetDefaultAppToTeams = useCallback(async () => {
		try {
			await setDefaultApp('expiry_teams');

			setApp('expiry_teams');
		} catch (error) {
			if (error instanceof Error) {
				captureException(error);
			}
		}
	}, [setApp]);

	return (
		<Container>
			<MainMenuContainer>
				<LogoContainer>
					{windowHeight > 600 ? (
						<Logo />
					) : (
						<MenuItemText style={{ color: '#fff' }}>
							{strings.AppName}
						</MenuItemText>
					)}
				</LogoContainer>
				<DrawerSection>
					<MenuItemContainer onPress={navigateHome}>
						<MenuContent>
							<Icons name="home-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToHome}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer onPress={navigateToAddProduct}>
						<MenuContent>
							<Icons name="add" />
							<MenuItemText>
								{strings.Menu_Button_GoToAddProduct}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<PROItems />
				</DrawerSection>
			</MainMenuContainer>

			<DrawerSection>
				{showTeams && (
					<MenuItemContainer onPress={handleSetDefaultAppToTeams}>
						<MenuContent>
							<Icons name="people-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToTeams}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				)}

				<MenuItemContainer onPress={handleNavigateToSettings}>
					<MenuContent>
						<Icons name="settings-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToSettings}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				<MenuItemContainer onPress={handleNavigateToAbout}>
					<MenuContent>
						<Icons name="help-circle-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToAbout}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				{__DEV__ && (
					<MenuItemContainer onPress={handleNavigateToTest}>
						<MenuContent>
							<Icons name="bug-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToTest}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				)}
			</DrawerSection>
		</Container>
	);
};

export default DrawerMenu;
