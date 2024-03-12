import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import Bugsnag from '@bugsnag/react-native';
import appCheck from '@react-native-firebase/app-check';
import { addDays } from 'date-fns';
import { showMessage } from 'react-native-flash-message';

import Button from '@components/Button';

import { Container, Category } from '@views/Settings/styles';
import { sendNotification } from '@services/Notifications';

import { handlePurchase } from '@utils/Purchases/HandlePurchase';

import realm from '@expirychecker/Services/Realm';
import {
	isTimeForANotification,
	setTimeForNextNotification,
} from '@expirychecker/Functions/Notifications';

import { getNotificationForAllProductsCloseToExp } from '@expirychecker/Functions/ProductsNotifications';

const Test: React.FC = () => {
	async function sampleData() {
		try {
			realm.write(() => {
				for (let i = 0; i < 20; i++) {
					const lastProduct = realm
						.objects<IProduct>('Product')
						.sorted('id', true)[0];
					const nextProductId =
						lastProduct == null ? 1 : lastProduct.id + 1;

					const lastLote = realm
						.objects<IBatch>('Lote')
						.sorted('id', true)[0];
					const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

					realm.create('Product', {
						id: nextProductId,
						name: `Product ${i}`,
						code: `${i}7841686${i}`,
						batches: [
							{
								id: nextLoteId,
								name: `ABC${i}xyz`,
								exp_date: addDays(new Date(), 1 * i),
								amount: i,
								status: 'Não tratado',
							},
							{
								id: nextLoteId + 1,
								name: `ABC${i}xyz21`,
								exp_date: addDays(new Date(), 1 * i),
								amount: i,
								status: 'Não tratado',
							},
						],
					});
				}
			});
		} catch (err) {
			console.log(err);
		}
	}

	const handleNotification = useCallback(async () => {
		await setTimeForNextNotification();

		const notification = await getNotificationForAllProductsCloseToExp();

		if (notification) {
			sendNotification(notification);
		}
	}, []);

	const functionThrowAnError = () => {
		try {
			throw new Error('Test error');
		} catch (error) {
			if (error instanceof Error) {
				Bugsnag.notify(error);
			}
		}
	};

	const handleCheckAppChekc = useCallback(async () => {
		try {
			const { token } = await appCheck().getToken(true);

			if (token.length > 0) {
				console.log(token);
				showMessage({
					message: 'Sucesso',
				});
			}
		} catch (error) {
			console.log(error);
			if (error instanceof Error)
				showMessage({
					type: 'danger',
					message: error.message,
				});
		}
	}, []);

	return (
		<Container>
			<ScrollView>
				<Category>
					<Button
						title="Load with sample data"
						onPress={sampleData}
					/>

					<Button
						title="Log is time to notificaiton"
						onPress={() =>
							isTimeForANotification().then(response =>
								console.log(response)
							)
						}
					/>

					<Button
						title="Throw notification"
						onPress={handleNotification}
					/>

					<Button title="Crash" onPress={functionThrowAnError} />

					<Button
						title="Test AppCheck"
						onPress={handleCheckAppChekc}
					/>

					<Button
						title="Handle Purchase"
						onPress={() => handlePurchase()}
					/>
				</Category>
			</ScrollView>
		</Container>
	);
};

export default Test;
