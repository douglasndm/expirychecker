import {
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    parseISO,
} from 'date-fns';
import Realm from '../Services/Realm';

export async function checkIfProductAlreadyExistsByCode(productCode) {
    try {
        const realm = await Realm();

        const results = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)
            .slice();

        if (results.length > 0) {
            return true;
        }
        return false;
    } catch (err) {
        console.warn(err);
    }

    return false;
}

export async function getProductByCode(productCode) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`code = "${productCode}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function getProductById(productId) {
    try {
        const realm = await Realm();

        const result = realm
            .objects('Product')
            .filtered(`id = "${productId}"`)[0];

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function createProduct(product) {
    try {
        const realm = await Realm();

        // BLOCO DE CÓDIGO RESPONSAVEL POR BUSCAR O ULTIMO ID NO BANCO E COLOCAR EM
        // UMA VARIAVEL INCREMENTANDO + 1 JÁ QUE O REALM NÃO SUPORTA AUTOINCREMENT (??)
        const lastProduct = realm.objects('Product').sorted('id', true)[0];
        const nextProductId = lastProduct == null ? 1 : lastProduct.id + 1;

        realm.write(() => {
            const productResult = realm.create('Product', {
                id: nextProductId,
                name: product.name,
                code: product.code,
                lotes: [],
            });

            const lotes = product.lotes.map((l) => {
                const lastLote = realm.objects('Lote').sorted('id', true)[0];
                const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

                // UM MONTE DE SETS PARA DEIXAR A HORA COMPLETAMENTE ZERADA
                // E CONSIDERAR APENAS OS DIAS NO CONTROLE DE VENCIMENTO
                const formatedDate = setHours(
                    setMinutes(
                        setSeconds(setMilliseconds(parseISO(l.exp_date), 0), 0),
                        0
                    ),
                    0
                );

                return {
                    id: nextLoteId,
                    lote: l.lote,
                    exp_date: formatedDate,
                    amount: parseInt(l.amount),
                };
            });

            productResult.lotes = lotes;
        });
    } catch (err) {
        console.warn(err.message);
    }
}
