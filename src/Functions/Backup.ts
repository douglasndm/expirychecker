import RNFS, {
	DocumentDirectoryPath,
	exists,
	mkdir,
	readDir,
	unlink,
} from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import DocumentPicker from 'react-native-document-picker';
import CryptoJS from 'crypto-js';
import EnvConfig from 'react-native-config';

import strings from '@expirychecker/Locales';

import { saveManyBrands } from '@expirychecker/Utils/Brands/SaveMany';
import { saveManyCategories } from '@expirychecker/Utils/Categories/SaveMany';

import { saveMany } from './Products';

const backupDir = `${DocumentDirectoryPath}/backupDir`;

export async function importBackupFile(): Promise<void> {
	const filePicked = await DocumentPicker.pickSingle({
		copyTo: 'documentDirectory',
	});

	if (!filePicked.fileCopyUri || !filePicked.name) {
		throw new Error('File path not found');
	}

	// Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
	const [, extension] = filePicked.name.split('.');

	// caso a extensão do arquivo não for cvbf lança um erro e sai da função
	if (extension !== 'cvbf' && extension !== 'zip') {
		throw new Error(strings.Function_Import_Error_InvalidExtesion);
	}

	let backupFilePath = null;

	if (!(await exists(backupDir))) {
		await mkdir(backupDir);
	}

	if (extension === 'zip') {
		let filePath = null;

		filePath = decodeURIComponent(filePicked.fileCopyUri);

		if (filePath) {
			await unzip(filePath, backupDir);

			if (await exists(`${backupDir}/backupImages.zip`)) {
				await unzip(
					`${backupDir}/backupImages.zip`,
					`${DocumentDirectoryPath}/images`
				);
			}
			const dir = await readDir(backupDir);
			const backupFile = dir.find(item => {
				const [, ext] = item.name.split('.');

				if (ext === 'cvbf') return true;
				return false;
			});

			if (backupFile?.name) {
				backupFilePath = `${backupDir}/${backupFile.name}`;
			}
		}
	}
	if (extension === 'cvbf') {
		backupFilePath = filePicked.fileCopyUri;
	}

	if (!backupFilePath) {
		throw new Error('Extesion is not valid');
	}

	// pega o arquivo temporario gerado pelo filePicker e faz a leitura dele
	const fileRead = await RNFS.readFile(backupFilePath);

	// decriptografa o arquivo lido
	const decryptedFile = CryptoJS.AES.decrypt(
		fileRead,
		EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT || ''
	);

	// converte o arquivo em formato de bytes puros para string
	const originalFile = decryptedFile.toString(CryptoJS.enc.Utf8);

	// converte tudo de novo para json
	const parsedFile = JSON.parse(originalFile);

	if (parsedFile.products) {
		if (parsedFile.categories) {
			const { categories } = parsedFile;

			await saveManyCategories(categories);
		}
		if (parsedFile.brands) {
			const { brands } = parsedFile;

			await saveManyBrands(brands);
		}
		const { products } = parsedFile;

		await saveMany(products);
	} else {
		await saveMany(parsedFile);
	}

	await unlink(backupDir);
}
