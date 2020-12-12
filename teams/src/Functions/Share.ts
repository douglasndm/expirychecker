import RNFS from 'react-native-fs';
import Share from 'react-native-share';

interface shareFileProps {
    fileAsString: string;
    fileName: string;
    fileExtesion: string;
    encoding?: string;
}

export async function shareFile({
    fileAsString,
    fileName,
    fileExtesion,
    encoding = 'utf8',
}: shareFileProps): Promise<void> {
    try {
        const path = `${RNFS.DocumentDirectoryPath}/${fileName}.${fileExtesion}`;

        // VERIFICA SE O ARQUIVO EXISTE E CASO EXISTA APAGUE ELE
        // POR ALGUM MOTIVO A LIB FAZ APPEND AUTOMATICO
        if (await RNFS.exists(path)) {
            await RNFS.unlink(path);
        }

        await RNFS.writeFile(path, fileAsString, encoding);

        await Share.open({
            title: 'Salvar',
            message: 'Escolha um local para salvar o arquivo',
            url: `file://${path}`,
        });
    } catch (err) {
        throw new Error(err);
    }
}
