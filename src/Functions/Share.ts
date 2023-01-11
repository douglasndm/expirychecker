import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import Analytics from '@react-native-firebase/analytics';

import { getProductImagePath } from './Products/Image';

interface ShareProductImageWithTextProps {
	productId: number;
	title: string;
	text: string;
}

export async function ShareProductImageWithText({
	productId,
	title,
	text,
}: ShareProductImageWithTextProps): Promise<void> {
	const imagePath = await getProductImagePath(productId);

	let shareOptions = {
		title,
		message: text,
		url: '',
	};

	if (imagePath !== null) {
		if (await RNFS.exists(imagePath)) {
			shareOptions = {
				...shareOptions,
				url: `file://${imagePath}`,
			};
		}
	}

	await Share.open(shareOptions);

	if (!__DEV__) await Analytics().logEvent('user_shared_a_product');
}
