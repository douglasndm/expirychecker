import { Platform } from 'react-native';
import RNFS, {
    DocumentDirectoryPath,
    exists,
    mkdir,
    readDir,
    unlink,
} from 'react-native-fs';
import { unzip, zip } from 'react-native-zip-archive';
import DocumentPicker from 'react-native-document-picker';
import Share from 'react-native-share';
import CryptoJS from 'crypto-js';
import EnvConfig from 'react-native-config';
import RNGRP from 'react-native-get-real-path';

import strings from '../Locales';

import { getAllProducts } from './Products';
import { getAllCategories } from './Category';
import { saveMany } from './Products/index';
import { saveManyCategories } from './Categories';

const backupDir = `${DocumentDirectoryPath}/backupDir`;

async function genereteZipImagesFolder(): Promise<string> {
    try {
        const allProducts = await getAllProducts({});

        const productsWithPics = allProducts.filter(p => p.photo);
        const dir = await readDir(DocumentDirectoryPath);

        const files: Array<IProductImage> = [];

        productsWithPics.forEach(p => {
            const findedPic = dir.find(
                file => file.name === p.photo || file.path === p.photo
            );

            if (findedPic) {
                files.push({
                    productId: p.id,
                    imageName: findedPic.name,
                    imagePath: findedPic.path,
                });
            }
        });

        const targetPath = `${backupDir}/backupImages.zip`;
        const sourcePath = `${DocumentDirectoryPath}/images`;

        if (await exists(targetPath)) {
            await unlink(targetPath);
        }

        // this will force the creation of images folder if it has been created, to avoid more verifications
        if (!(await exists(sourcePath))) {
            await mkdir(sourcePath);
        }

        const zipPath = await zip(sourcePath, targetPath);

        return zipPath;
    } catch (err) {
        throw new Error(err.message);
    }
}

interface generateBackupFileProps {
    includeCategories?: boolean;
    store?: string;
}

export async function generateBackupFile({
    includeCategories = true,
    store,
}: generateBackupFileProps): Promise<string> {
    if (!(await exists(`${backupDir}`))) {
        await mkdir(`${backupDir}`);
    }

    const categories = await getAllCategories();

    let result;

    const allProducts = await getAllProducts({});

    if (includeCategories) {
        result = {
            categories,
        };
    }

    if (store && store !== 'none') {
        const filtedProducts = allProducts.filter(prod => {
            if (prod.store?.includes(store)) {
                return true;
            }

            return false;
        });

        result = {
            ...result,
            products: filtedProducts,
        };
    } else if (store === 'none') {
        const filtedProducts = allProducts.filter(prod => {
            if (!prod.store) {
                return true;
            }

            return false;
        });

        result = {
            ...result,
            products: filtedProducts,
        };
    } else {
        result = {
            ...result,
            products: allProducts,
        };
    }

    const encryptedProducts = CryptoJS.AES.encrypt(
        JSON.stringify(result),
        EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
    ).toString();

    await genereteZipImagesFolder();

    const productsFilePath = `${backupDir}/${strings.Function_Export_FileName}.cvbf`;

    // VERIFICA SE O ARQUIVO EXISTE E CASO EXISTA APAGUE ELE
    // POR ALGUM MOTIVO A LIB FAZ APPEND AUTOMATICO
    if (await RNFS.exists(productsFilePath)) {
        await RNFS.unlink(productsFilePath);
    }

    await RNFS.writeFile(productsFilePath, encryptedProducts, 'utf8');

    return productsFilePath;
}

export async function exportBackupFile(): Promise<void> {
    await generateBackupFile({});

    const zipPath = await zip(
        `${backupDir}`,
        `${DocumentDirectoryPath}/${strings.Function_Export_FileName}.zip`
    );

    await Share.open({
        title: strings.Function_Share_SaveFileTitle,
        url: `file://${zipPath}`,
    });

    await unlink(`${backupDir}`);
}

export async function importBackupFile(): Promise<void> {
    const options = {
        type: Platform.OS === 'ios' ? 'public.item' : '*/*',
        copyTo: 'documentDirectory',
    };

    const filePicked = await DocumentPicker.pick(options);

    // Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
    const [, extension] = filePicked.name.split('.');

    // caso a extensão do arquivo não for cvbf lança um erro e sai da função
    if (extension !== 'cvbf' && extension !== 'zip') {
        throw new Error(strings.Function_Import_Error_InvalidExtesion);
    }

    let backupFilePath = null;

    if (extension === 'zip') {
        if (!(await exists(backupDir))) {
            await mkdir(backupDir);
        }

        let filePath = null;

        if (Platform.OS === 'android') {
            filePath = await RNGRP.getRealPathFromURI(filePicked.uri);
        } else {
            filePath = filePicked.fileCopyUri;
        }

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
        EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
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
        const { products } = parsedFile;

        await saveMany(products);
    } else {
        await saveMany(parsedFile);
    }

    await unlink(backupDir);
}
interface IProductImage {
    productId: number;
    imagePath: string;
    imageName: string;
}
