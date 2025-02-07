import { exists, unlink } from 'react-native-fs';

import { getImagePath } from './GetPath';

async function deleteImage(fileName: string): Promise<void> {
	const imagePath = await getImagePath(fileName);

	if (imagePath.trim() !== '') {
		if (await exists(imagePath)) {
			await unlink(imagePath);
		}
	}
}

export { deleteImage };
