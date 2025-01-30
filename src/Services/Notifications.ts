import { saveNotificationStatus } from '@expirychecker/Services/Firebase/Firestore';

import { getNotificationForAllProductsCloseToExp } from '@expirychecker/Functions/ProductsNotifications';

async function prepareNotification(): Promise<void> {
	const notification = await getNotificationForAllProductsCloseToExp();

	if (notification) {
		saveNotificationStatus({
			notificationTitle: notification.title,
			notificationString: notification.message,
		});
	}
}

prepareNotification();
