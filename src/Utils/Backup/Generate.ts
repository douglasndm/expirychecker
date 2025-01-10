import {
	DocumentDirectoryPath,
	exists,
	mkdir,
	unlink,
	writeFile,
} from 'react-native-fs';
import { zip } from 'react-native-zip-archive';

import strings from '@expirychecker/Locales';

import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';

const backupDir = `${DocumentDirectoryPath}/backup`;

async function generateImagesBackup(): Promise<string> {
	const targetPath = `${backupDir}/Images.zip`;
	const sourcePath = `${DocumentDirectoryPath}/images`;

	const fileExists = await exists(targetPath);

	// makes sure everything is clean
	if (fileExists) {
		await unlink(targetPath);
	}

	if (!(await exists(sourcePath))) {
		await mkdir(sourcePath);
	}

	const imagesZipPath = await zip(sourcePath, targetPath);

	return imagesZipPath;
}

async function generateBackup(): Promise<string> {
	const brands = await getAllBrands();
	const categories = await getAllCategories();
	const stores = await getAllStores();
	const products = await getAllProductsAsync({
		removeProductsWithoutBatches: false,
		removeTreatedBatch: false,
		sortProductsByExpDate: false,
	});

	const backup = {
		brands,
		categories,
		stores,
		products,
	};

	const dirExists = await exists(backupDir);

	// makes sure everything is clean
	if (dirExists) {
		await unlink(`${backupDir}`);
	}
	await mkdir(`${backupDir}`);

	const backupPath = `${backupDir}/${strings.Function_Export_FileName}.cvbf`;
	await writeFile(backupPath, JSON.stringify(backup), 'utf8');

	await generateImagesBackup();

	return backupDir;
}

export { generateBackup };
