import React, {
	useState,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from 'react';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'styled-components';

import strings from '@shared/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import WeightIcon from '@assets/Icons/shipment-weight-kg.png';
import WeightIconDark from '@assets/Icons/shipment-weight-kg-dark.png';
import LitersIcon from '@assets/Icons/water-glass-half-full.png';
import LitersIconDark from '@assets/Icons/water-glass-half-full-dark.png';

import {
	MenuItemContainer,
	MenuContent,
	MenuItemText,
	Icons,
	LabelGroup,
	LabelContainer,
	Label,
} from '@components/Menu/Drawer/styles';

import Paywall, { MenuPaywallProps } from './Paywall';
import { LoadContainer, LoadIndicator } from './styles';

const PRO: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const theme = useTheme();

	const paywallRef = useRef<MenuPaywallProps>(null);

	const { userPreferences } = useContext(PreferencesContext);
	const [isPaywallOpen, setIsPaywallOpen] = useState(false);

	const isPro = useMemo(() => {
		return userPreferences.isPRO;
	}, [userPreferences.isPRO]);

	const navigateToSortedByWeight = useCallback(() => {
		navigate('ProductsSortedByWeight');
	}, [navigate]);

	const navigateToSortedByLiters = useCallback(() => {
		navigate('ProductsSortedByLiters');
	}, [navigate]);

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

	const handleOpenPaywall = useCallback(() => {
		if (paywallRef.current) {
			paywallRef.current.handlePaywall();
		}
	}, [paywallRef]);

	return (
		<>
			{isPaywallOpen && (
				<LoadContainer>
					<LoadIndicator />
				</LoadContainer>
			)}

			<Paywall
				ref={paywallRef}
				isPaywallOpen={isPaywallOpen}
				setIsPaywallOpen={setIsPaywallOpen}
			/>

			<MenuItemContainer
				disabled={isPaywallOpen}
				onPress={isPro ? navigateToSortedByWeight : handleOpenPaywall}
			>
				<MenuContent>
					<Image
						source={!theme.isDark ? WeightIconDark : WeightIcon}
						style={{ width: 22, height: 22 }}
					/>
					<MenuItemText>
						{strings.Menu_Button_GoToSortedByWeight}
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
				onPress={isPro ? navigateToSortedByLiters : handleOpenPaywall}
			>
				<MenuContent>
					<Image
						source={!theme.isDark ? LitersIconDark : LitersIcon}
						style={{ width: 22, height: 22 }}
					/>
					<MenuItemText>
						{strings.Menu_Button_GoToSortedByLiters}
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
				onPress={isPro ? navigateToCategories : handleOpenPaywall}
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
				onPress={isPro ? navigateToBrands : handleOpenPaywall}
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
					isPro ? navigateToAllProductsByStore : handleOpenPaywall
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
				onPress={isPro ? navigateToExport : handleOpenPaywall}
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

			{!isPro && (
				<MenuItemContainer
					disabled={isPaywallOpen}
					onPress={handleOpenPaywall}
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
