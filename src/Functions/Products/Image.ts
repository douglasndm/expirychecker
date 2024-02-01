import {
	DocumentDirectoryPath,
	exists,
	unlink,
	mkdir,
	copyFile,
} from 'react-native-fs';

import { getImagePath } from '@expirychecker/Utils/Products/Images/GetPath';

import { getProductById, updateProduct } from '../Product';

export function getImageFileNameFromPath(path: string): string {
	const productImage = path.split('/');

	const fileName = productImage[productImage.length - 1];

	return fileName;
}

interface saveProductIamgeProps {
	fileName: string;
	productId: number;
}

export async function saveProductImage({
	fileName,
	productId,
}: saveProductIamgeProps): Promise<void> {
	const product = await getProductById(productId);

	let path;

	// For old users at 1.7.1 (app was save all path, not only file name)
	if (await exists(fileName)) {
		path = fileName;
	} else {
		path = await getImagePath(fileName);
	}

	if (!path) {
		throw new Error('Image path was not defined');
	}

	if (product.photo) {
		const oldImagePath = await getImagePath(product.photo);

		if (oldImagePath) {
			if (await exists(oldImagePath)) {
				await unlink(oldImagePath);
			}
		}
	}

	await updateProduct({
		...product,
		id: productId,
		photo: fileName,
	});
}

interface copyTempImageResponse {
	fileName: string;
	filePath: string;
}

export async function copyImageFromTempDirToDefinitiveDir(
	tempPath: string
): Promise<copyTempImageResponse> {
	const splited = tempPath.split('/');
	const generatedFilneName = splited[splited.length - 1];

	const fileName = `${Date.now()}-${generatedFilneName}`;

	const existsFolder = await exists(`${DocumentDirectoryPath}/images`);
	if (!existsFolder) {
		await mkdir(`${DocumentDirectoryPath}/images`);
	}

	const newPath = `${DocumentDirectoryPath}/images/${fileName}`;

	await copyFile(tempPath, newPath);
	await unlink(tempPath);

	return {
		fileName,
		filePath: newPath,
	};
}
