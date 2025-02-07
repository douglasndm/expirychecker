import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import Purchases from '@services/RevenueCat';
import { captureException } from '@services/ExceptionsHandler';

import { handlePurchase } from '@expirychecker/Utils/Purchases/HandlePurchase';

import { setDisableAds, setEnableProVersion } from './Settings';

export async function isSubscriptionActive(): Promise<boolean> {
	const netInfo = await NetInfo.fetch();
	if (!netInfo.isInternetReachable) return false;

	let firebase: string | null = null;

	try {
		firebase = await messaging().getToken();

		if (firebase) {
			Purchases.setAttributes({
				FirebaseMessasingToken: firebase,
			});
		}
	} catch (error) {
		console.log(error);
	}

	try {
		const purchaserInfo = await Purchases.getCustomerInfo();

		if (purchaserInfo.activeSubscriptions.length === 0) {
			//  User was subcriber before, but now is not
			if (purchaserInfo.allPurchasedProductIdentifiers.length > 0) {
				showMessage({
					message: strings.View_Component_ExpiredSubscription_Title,
					description:
						strings.View_Component_ExpiredSubscription_Description2,
					duration: 10000,
					type: 'warning',
					onPress: async () => {
						await handlePurchase();
					},
				});
			}

			return false;
		}

		if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
			await setEnableProVersion(true);
			return true;
		}
		if (typeof purchaserInfo.entitlements.active.noads !== 'undefined') {
			await setDisableAds(true);
		} else {
			await setDisableAds(false);
		}
		await setEnableProVersion(false);
		return false;
	} catch (error) {
		captureException({ error });
	}
	return false;
}

// Chama a função para verificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive().then(() => console.log('Subscription checked'));
