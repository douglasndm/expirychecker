import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import DocumentPicker from 'react-native-document-picker';
import CryptoJS from 'crypto-js';
import EnvConfig from 'react-native-config';

import { createProduct } from './Product';
import { GetAllProducts } from './Products';

export async function ExportBackupFile(): Promise<void> {
    try {
        const allProducts = await GetAllProducts();

        // O REALM GRAVA TUDO EM OBJETOS E NÃO EM ARRAYS
        // ISSO CONVERTE TUDO EM ARRAYS
        // APENAS PARA ORGANIZAÇÃO FUTURA
        const arrayProducts: Array<IProduct> = [];

        allProducts.forEach((p) => {
            const arrayLotes: Array<ILote> = [];

            if (p.lotes.length > 0) {
                p.lotes.forEach((lote) => arrayLotes.push(lote));
            }

            const newProduct = {
                id: p.id,
                name: p.name,
                code: p.code,
                store: p.store,
                lotes: arrayLotes,
            };

            arrayProducts.push(newProduct);
        });

        // Definindo caminho do arquivo "Controle de validade backup file"
        // Muito legal o nome da extensão né?
        const path = `${RNFS.DocumentDirectoryPath}/controledevalidade.cvbf`;

        const encryptedProducts = CryptoJS.AES.encrypt(
            JSON.stringify(arrayProducts),
            EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
        ).toString();

        // VERIFICA SE O ARQUIVO EXISTE E CASO EXISTA APAGUE ELE
        // POR ALGUM MOTIVO A LIB FAZ APPEND AUTOMATICO
        if (await RNFS.exists(path)) {
            RNFS.unlink(path);
        }

        // write the file
        RNFS.writeFile(path, encryptedProducts, 'utf8')
            .then(() => {
                Share.open({
                    title: 'Salvar arquivo de exportação',
                    message:
                        'Escolha um lugar para salvar o arquivo de exportação',
                    url: `file://${path}`,
                });
            })
            .catch((err) => {
                throw new Error(err);
            });
    } catch (err) {
        console.warn(err);
    }
}

export async function ImportBackupFile(): Promise<void> {
    try {
        const filePicked = await DocumentPicker.pick();

        // Separa o nome do arquivo da extensão para fazer a validação da extensão do arquivo
        const [, extension] = filePicked.name.split('.');

        // caso a extensão do arquivo não for cvbf lança um erro e sai da função
        if (extension !== 'cvbf') {
            throw new Error('Extensão invalida');
        }

        // pega o arquivo temporario gerado pelo filePicker e faz a leitura dele
        const fileRead = await RNFS.readFile(filePicked.fileCopyUri);

        // decriptografa o arquivo lido
        const decryptedFile = CryptoJS.AES.decrypt(
            fileRead,
            EnvConfig.APPLICATION_SECRET_BACKUP_CRYPT
        );

        // converte o arquivo em formato de bytes puros para string
        const originalFile = decryptedFile.toString(CryptoJS.enc.Utf8);

        // converte tudo de novo para json
        const products = JSON.parse(originalFile);

        for (const p of products) {
            await createProduct({ product: p, ignoreDuplicate: true });
        }
    } catch (err) {
        console.log(err.message);
    }
}
