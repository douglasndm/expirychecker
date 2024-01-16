import React, { useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

import strings from '@expirychecker/Locales';

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

const DrawerMenu: React.FC<DrawerContentComponentProps> = (
	props: DrawerContentComponentProps
) => {
	const { navigation } = props;

	const windowHeight = useWindowDimensions().height;

	const navigateToAddProduct = useCallback(() => {
		navigation.navigate('AddProduct');
	}, [navigation]);

	const navigateToAllProducts = useCallback(() => {
		navigation.navigate('AllProducts');
	}, [navigation]);

	const handleNavigateToTeams = useCallback(() => {
		navigation.navigate('Teams');
	}, [navigation]);

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
					<MenuItemContainer
						onPress={() => navigation.navigate('Home')}
					>
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

					<MenuItemContainer onPress={navigateToAllProducts}>
						<MenuContent>
							<Icons name="apps-outline" />
							<MenuItemText>
								{strings.Menu_Button_GoToAllProducts}
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<PROItems navigation={navigation} />
				</DrawerSection>
			</MainMenuContainer>

			<DrawerSection>
				<MenuItemContainer onPress={handleNavigateToTeams}>
					<MenuContent>
						<Icons name="people-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToTeams}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				<MenuItemContainer
					onPress={() => navigation.navigate('Settings')}
				>
					<MenuContent>
						<Icons name="settings-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToSettings}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				<MenuItemContainer onPress={() => navigation.navigate('About')}>
					<MenuContent>
						<Icons name="help-circle-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToAbout}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>

				{__DEV__ && (
					<MenuItemContainer
						onPress={() => navigation.navigate('Test')}
					>
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
