import { DocumentDirectoryPath, readDir } from 'react-native-fs';

import { captureException } from '@services/ExceptionsHandler';

async function getImagePath(fileName: string): Promise<string> {
	const filesDir = await readDir(`${DocumentDirectoryPath}/images`);

	const findedFile = filesDir.find(
		file => file.name.toLowerCase() === fileName.toLowerCase()
	);

	if (!findedFile) {
		captureException({
			error: new Error('File was not find'),
			customData: {
				fileName,
				filesDir,
			},
		});
		return '';
	}

	return findedFile.path;
}

export { getImagePath };
