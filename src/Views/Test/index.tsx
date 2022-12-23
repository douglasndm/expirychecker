import React, { useCallback, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { exists } from 'react-native-fs';
import { addDays } from 'date-fns';

import Button from '@components/Button';

import { Container, Category } from '@views/Settings/styles';
import realm from '~/Services/Realm';
import {
	isTimeForANotification,
	setTimeForNextNotification,
} from '~/Functions/Notifications';

import { getNotificationForAllProductsCloseToExp } from '~/Functions/ProductsNotifications';
import { sendNotification } from '~/Services/Notifications';
import Camera from '~/Components/Camera';

const Test: React.FC = () => {
	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [photoPath, setPhotoPath] = useState('');

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
						.objects<ILote>('Lote')
						.sorted('id', true)[0];
					const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

					realm.create('Product', {
						id: nextProductId,
						name: `Product ${i}`,
						code: `${i}7841686${i}`,
						photo: `${photoPath}`,
						lotes: [
							{
								id: nextLoteId,
								lote: `ABC${i}xyz`,
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

	async function deleteProducts() {
		try {
			realm.write(() => {
				realm.deleteAll();
			});
		} catch (err) {
			console.warn(err);
		}
	}

	const handleNotification = useCallback(async () => {
		await setTimeForNextNotification();

		const notification = await getNotificationForAllProductsCloseToExp();

		if (notification) {
			sendNotification(notification);
		}
	}, []);

	const handleDisableCamera = useCallback(() => {
		setIsCameraEnabled(false);
	}, []);

	const onPhotoTaked = useCallback(
		async ({ filePath }: onPhotoTakedProps) => {
			if (await exists(filePath)) {
				setPhotoPath(filePath);
			}

			handleDisableCamera();
		},
		[handleDisableCamera]
	);

	return (
		<>
			{isCameraEnabled ? (
				<Camera
					onPhotoTaked={onPhotoTaked}
					onBackButtonPressed={handleDisableCamera}
				/>
			) : (
				<Container>
					<ScrollView>
						<Category>
							<Text>{photoPath}</Text>
							<Button
								text="Enable camera"
								onPress={() => setIsCameraEnabled(true)}
							/>

							<Button
								text="Load with sample data"
								onPress={sampleData}
							/>

							<Button
								text="Delete all realm data"
								onPress={deleteProducts}
							/>

							<Button
								text="Log is time to notificaiton"
								onPress={() =>
									isTimeForANotification().then(response =>
										console.log(response)
									)
								}
							/>

							<Button
								text="Throw notification"
								onPress={handleNotification}
							/>
						</Category>
					</ScrollView>
				</Container>
			)}
		</>
	);
};

export default Test;
