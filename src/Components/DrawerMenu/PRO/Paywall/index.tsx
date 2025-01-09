import React, {
	useCallback,
	useContext,
	forwardRef,
	useImperativeHandle,
} from 'react';
import { showMessage } from 'react-native-flash-message';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { handlePurchase } from '@expirychecker/Utils/Purchases/HandlePurchase';

export interface MenuPaywallProps {
	isPaywallOpen: boolean;
	setIsPaywallOpen: (value: boolean) => void;
	handlePaywall: () => Promise<void>;
}
const Paywall = forwardRef<MenuPaywallProps>((props: MenuPaywallProps, ref) => {
	const { userPreferences, setUserPreferences } =
		useContext(PreferencesContext);

	const handlePaywall = useCallback(async () => {
		try {
			props.setIsPaywallOpen(true);

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
			props.setIsPaywallOpen(false);
		}
	}, [props, setUserPreferences, userPreferences]);

	useImperativeHandle(
		ref,
		() => ({
			isPaywallOpen: props.isPaywallOpen,
			setIsPaywallOpen: props.setIsPaywallOpen,
			handlePaywall,
		}),
		[handlePaywall]
	);

	return <></>;
});

Paywall.displayName = 'Menu paywall';

export default Paywall;
