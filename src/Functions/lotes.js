import {
    setHours,
    setMinutes,
    setSeconds,
    setMilliseconds,
    parseISO,
    isValid,
} from 'date-fns';

import Realm from '../Services/Realm';

import { getProductByCode } from './Product';

export function sortLoteByExpDate(lotes) {
    // Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
    // e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
    // solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
    // para ai sim ser possível fazer o sort
    const arrayTemp = lotes.map((l) => l); // READ BEFORE DELETE

    if (arrayTemp.length > 2) {
        const lotesSorted = arrayTemp.sort((l1, l2) => {
            if (l1.exp_date > l2.exp_date) return 1;
            if (l1.exp_date < l2.exp_date) return -1;
            return 0;
        });

        return lotesSorted;
    }
    return arrayTemp;
}

export function removeLotesTratados(lotes) {
    // Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
    // e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
    // solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
    // para ai sim ser possível fazer o sort
    const arrayTemp = lotes.map((l) => l); // READ BEFORE DELETE

    const results = arrayTemp.filter((lote) => {
        if (lote.status === 'Tratado') return false;
        return true;
    });

    return results;
}

export async function checkIfLoteAlreadyExists(loteName, productCode) {
    try {
        const product = await getProductByCode(productCode);

        if (!product) {
            return false;
        }
        const productsLotes = product.lotes.filter((l) => {
            if (l.lote === loteName) {
                return true;
            }
            return false;
        });

        if (productsLotes.length > 0) {
            return true;
        }

        return false;
    } catch (err) {
        console.warn(err.message);
    }

    return false;
}

export async function createLote(lote, productCode) {
    if (await checkIfLoteAlreadyExists(lote.lote, productCode)) {
        return false;
    }

    try {
        const realm = await Realm();

        realm.write(() => {
            const product = realm
                .objects('Product')
                .filtered(`code = "${productCode}"`)
                .slice();

            if (product.length < 1) {
                throw new Error(
                    'Produto não encontrado, não é possível adicionar o lote'
                );
            }

            const lastLote = realm.objects('Lote').sorted('id', true)[0];
            const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

            // UM MONTE DE SETS PARA DEIXAR A HORA COMPLETAMENTE ZERADA
            // E CONSIDERAR APENAS OS DIAS NO CONTROLE DE VENCIMENTO
            const formatedDate = setHours(
                setMinutes(
                    setSeconds(
                        setMilliseconds(
                            isValid(lote.exp_date)
                                ? lote.exp_date
                                : parseISO(lote.exp_date),
                            0
                        ),
                        0
                    ),
                    0
                ),
                0
            );

            const loteAmount =
                typeof lote.amount === 'string' || lote.amount instanceof String
                    ? Number(lote.amount)
                    : lote.amount;

            product[0].lotes.push({
                id: nextLoteId,
                lote: lote.lote,
                exp_date: formatedDate,
                amount: loteAmount,
                status: lote.status,
            });
        });
    } catch (err) {
        console.warn(err.message);
    }

    return null;
}
