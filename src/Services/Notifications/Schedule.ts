import notifee, {
	IntervalTrigger,
	RepeatFrequency,
	TimeUnit,
	TimestampTrigger,
	TriggerType,
} from '@notifee/react-native';

import '@services/Notifications/ClearBadge';

import { getNotificationForAllProductsCloseToExp } from '@expirychecker/Functions/ProductsNotifications';

async function createTriggerNotification() {
	const date = new Date(Date.now());
	date.setHours(9);
	date.setMinutes(0);

	// Create a time-based trigger
	// const trigger: TimestampTrigger = {
	// 	type: TriggerType.TIMESTAMP,
	// 	timestamp: date.getTime(), // fire at 9:00am
	// 	repeatFrequency: RepeatFrequency.DAILY,
	// };

	const trigger: IntervalTrigger = {
		type: TriggerType.INTERVAL,
		interval: 15,
		timeUnit: TimeUnit.MINUTES,
	};

	const notification = await getNotificationForAllProductsCloseToExp();

	if (!notification) {
		return;
	}

	console.log('schedule notification');
	console.log(notification.message);

	// Create a trigger notification
	await notifee.createTriggerNotification(
		{
			title: notification.title,
			body: notification.message,

			android: {
				channelId: 'default-notifications',
				smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
				// pressAction is needed if you want the notification to open the app when pressed
				badgeCount: notification.amount,
				pressAction: {
					id: 'default',
				},
			},
			ios: {
				badgeCount: notification.amount,
				sound: 'swiftly-610.m4r',
			},
		},
		trigger
	);
}

// createTriggerNotification();
