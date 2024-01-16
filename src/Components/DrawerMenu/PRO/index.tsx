import React, { useState, useCallback, useMemo, useContext } from 'react';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import {
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	LabelGroup,
	LabelContainer,
	Label,
} from '@components/Menu/Drawer/styles';

import { showMessage } from 'react-native-flash-message';
import { LoadContainer, LoadIndicator } from './styles';

interface Props {
	navigation: DrawerNavigationHelpers;
}

const PRO: React.FC<Props> = ({ navigation }: Props) => {
	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);
	const [isPaywallOpen, setIsPaywallOpen] = useState(false);

	const shouldShowMultiplesStores = useMemo(() => {
		if (!userPreferences.isPRO) {
			return true;
		}

		if (userPreferences.isPRO && userPreferences.multiplesStores) {
			return true;
		}

		return false;
	}, [userPreferences]);

	const navigateToCategories = useCallback(() => {
		navigation.navigate('ListCategory');
	}, [navigation]);

	const navigateToAllProductsByStore = useCallback(() => {
		navigation.navigate('StoreList');
	}, [navigation]);

	const navigateToBrands = useCallback(() => {
		navigation.navigate('BrandList');
	}, [navigation]);

	const navigateToExport = useCallback(() => {
		navigation.navigate('Export');
	}, [navigation]);

	const handlePaywall = useCallback(async () => {
		try {
			setIsPaywallOpen(true);
			const paywallResult: PAYWALL_RESULT =
				await RevenueCatUI.presentPaywallIfNeeded({
					requiredEntitlementIdentifier: 'pro',
				});

			if (
				paywallResult === PAYWALL_RESULT.PURCHASED ||
				paywallResult === PAYWALL_RESULT.RESTORED
			) {
				setUserPreferences({
					...userPreferences,
					isPRO: true,
					disableAds: true,
				});

				if (paywallResult === PAYWALL_RESULT.PURCHASED) {
					showMessage({
						message: strings.View_Pro_Alert_Welcome,
						type: 'info',
					});
				} else if (paywallResult === PAYWALL_RESULT.RESTORED) {
					showMessage({
						message:
							strings.View_PROView_Subscription_Alert_RestoreSuccess,
						type: 'info',
					});
				}
			}

			console.log(paywallResult);
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

			{shouldShowMultiplesStores && (
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
			)}

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
