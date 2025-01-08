import React, { useState, useCallback, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { handlePurchase } from '@expirychecker/Utils/Purchases/HandlePurchase';

import {
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	LabelGroup,
	LabelContainer,
	Label,
} from '@components/Menu/Drawer/styles';

import { LoadContainer, LoadIndicator } from './styles';

const PRO: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);
	const [isPaywallOpen, setIsPaywallOpen] = useState(false);

	const navigateToCategories = useCallback(() => {
		navigate('ListCategory');
	}, [navigate]);

	const navigateToAllProductsByStore = useCallback(() => {
		navigate('StoreList');
	}, [navigate]);

	const navigateToBrands = useCallback(() => {
		navigate('BrandList');
	}, [navigate]);

	const navigateToExport = useCallback(() => {
		navigate('Export');
	}, [navigate]);

	const handlePaywall = useCallback(async () => {
		try {
			setIsPaywallOpen(true);

			const response = await handlePurchase();

			if (response) {
				setUserPreferences({
					...userPreferences,
					isPRO: response,
					disableAds: response,
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			}
		} finally {
			setIsPaywallOpen(false);
		}
	}, [setUserPreferences, userPreferences]);

	return (
		<>
			{isPaywallOpen && (
				<LoadContainer>
					<LoadIndicator />
				</LoadContainer>
			)}
			{__DEV__ && (
				<>
					<MenuItemContainer
						disabled={isPaywallOpen}
						onPress={
							userPreferences.isPRO
								? navigateToCategories
								: handlePaywall
						}
					>
						<MenuContent>
							<Icons name="file-tray-full-outline" />
							<MenuItemText>
								Produtos ordenados por peso
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>

					<MenuItemContainer
						disabled={isPaywallOpen}
						onPress={
							userPreferences.isPRO
								? navigateToCategories
								: handlePaywall
						}
					>
						<MenuContent>
							<Icons name="file-tray-full-outline" />
							<MenuItemText>
								Produtos ordenados por litros
							</MenuItemText>
						</MenuContent>
					</MenuItemContainer>
				</>
			)}
			<MenuItemContainer
				disabled={isPaywallOpen}
				onPress={
					userPreferences.isPRO ? navigateToCategories : handlePaywall
				}
			>
				<MenuContent>
					<Icons name="file-tray-full-outline" />
					<MenuItemText>
						{strings.Menu_Button_GoToCategories}
					</MenuItemText>
				</MenuContent>

				<LabelGroup>
					<LabelContainer>
						<Label>{strings.Menu_Label_PRO}</Label>
					</LabelContainer>
				</LabelGroup>
			</MenuItemContainer>

			<MenuItemContainer
				disabled={isPaywallOpen}
				onPress={
					userPreferences.isPRO ? navigateToBrands : handlePaywall
				}
			>
				<MenuContent>
					<Icons name="ribbon-outline" />
					<MenuItemText>
						{strings.Menu_Button_GoToBrands}
					</MenuItemText>
				</MenuContent>

				<LabelGroup>
					<LabelContainer>
						<Label>{strings.Menu_Label_PRO}</Label>
					</LabelContainer>
				</LabelGroup>
			</MenuItemContainer>

			<MenuItemContainer
				disabled={isPaywallOpen}
				onPress={
					userPreferences.isPRO
						? navigateToAllProductsByStore
						: handlePaywall
				}
			>
				<MenuContent>
					<Icons name="list-outline" />
					<MenuItemText>
						{strings.Menu_Button_GoToStores}
					</MenuItemText>
				</MenuContent>

				<LabelGroup>
					<LabelContainer>
						<Label>{strings.Menu_Label_PRO}</Label>
					</LabelContainer>
				</LabelGroup>
			</MenuItemContainer>

			<MenuItemContainer
				disabled={isPaywallOpen}
				onPress={
					userPreferences.isPRO ? navigateToExport : handlePaywall
				}
			>
				<MenuContent>
					<Icons name="download-outline" />
					<MenuItemText>
						{strings.Menu_Button_GoToExport}
					</MenuItemText>
				</MenuContent>

				<LabelGroup>
					<LabelContainer>
						<Label>{strings.Menu_Label_PRO}</Label>
					</LabelContainer>
				</LabelGroup>
			</MenuItemContainer>

			{!userPreferences.isPRO && (
				<MenuItemContainer
					disabled={isPaywallOpen}
					onPress={handlePaywall}
				>
					<MenuContent>
						<Icons name="analytics-outline" />
						<MenuItemText>
							{strings.Menu_Button_GoToProPage}
						</MenuItemText>
					</MenuContent>
				</MenuItemContainer>
			)}
		</>
	);
};

export default PRO;
