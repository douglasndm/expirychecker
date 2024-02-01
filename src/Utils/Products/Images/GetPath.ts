import { DocumentDirectoryPath, readDir } from 'react-native-fs';

async function getImagePath(fileName: string): Promise<string> {
	const filesDir = await readDir(`${DocumentDirectoryPath}/images`);

	const findedFile = filesDir.find(
		file => file.name.toLowerCase() === fileName.toLowerCase()
	);

	if (!findedFile) {
		throw new Error('File was not find');
	}

	return findedFile.path;
}

export { getImagePath };
