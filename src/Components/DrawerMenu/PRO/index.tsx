import React, {
	useState,
	useCallback,
	useContext,
	useRef,
	useMemo,
} from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '@expirychecker/Locales';
import sharedStrings from '@shared/Locales';

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

import Paywall, { MenuPaywallProps } from './Paywall';
import { LoadContainer, LoadIndicator } from './styles';

const PRO: React.FC = () => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

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
			{__DEV__ && (
				<>
					<Paywall
						ref={paywallRef}
						isPaywallOpen={isPaywallOpen}
						setIsPaywallOpen={setIsPaywallOpen}
					/>

					<MenuItemContainer
						disabled={isPaywallOpen}
						onPress={
							isPro ? navigateToSortedByWeight : handleOpenPaywall
						}
					>
						<MenuContent>
							<Icons name="file-tray-full-outline" />
							<MenuItemText>
								{sharedStrings.Menu_Button_GoToSortedByWeight}
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
							isPro ? navigateToSortedByLiters : handleOpenPaywall
						}
					>
						<MenuContent>
							<Icons name="file-tray-full-outline" />
							<MenuItemText>
								{sharedStrings.Menu_Button_GoToSortedByLiters}
							</MenuItemText>
						</MenuContent>

						<LabelGroup>
							<LabelContainer>
								<Label>{strings.Menu_Label_PRO}</Label>
							</LabelContainer>
						</LabelGroup>
					</MenuItemContainer>
				</>
			)}
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
