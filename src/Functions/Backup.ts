import RNFS, {
	DocumentDirectoryPath,
	exists,
	mkdir,
	readDir,
	unlink,
} from 'react-native-fs';
import { unzip } from 'react-native-zip-archive';
import DocumentPicker from 'react-native-document-picker';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { saveManyBrands } from '@expirychecker/Utils/Brands/SaveMany';
import { saveManyCategories } from '@expirychecker/Utils/Categories/SaveMany';

import { saveMany } from './Products';

const backupDir = `${DocumentDirectoryPath}/backupDir`;

/**
 * Função responsável por importar um arquivo de backup no formato .cvbf ou .zip
 * para o aplicativo.
 *
 * @returns {Promise<boolean>} Retorna true se o backup for importado com sucesso, false caso contrário.
 */
export async function importBackupFile(): Promise<boolean> {
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
		showMessage({
			message: strings.Function_Import_Error_InvalidExtesion,
			type: 'warning',
		});
		return false;
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
	} else if (extension === 'cvbf') {
		backupFilePath = filePicked.fileCopyUri;
	}

	if (!backupFilePath) {
		showMessage({
			message: strings.Function_Import_Error_InvalidExtesion,
			type: 'warning',
		});
		return false;
	}

	// pega o arquivo temporario gerado pelo filePicker e faz a leitura dele
	const fileRead = await RNFS.readFile(backupFilePath);

	// converte tudo de novo para json
	const parsedFile = JSON.parse(fileRead);

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
	return true;
}
