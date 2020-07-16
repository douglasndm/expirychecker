import { sortLoteByExpDate } from './lotes';

// FUNÇÃO QUE REMOVE TODOS OS PRODUTOS QUE JÁ FORAM TRATADOS ANTES DE CHAMAR AS PROXIMAS
export function getLotesWithoutTratados(listProducts) {
    const resultsWithoutLotesProcessed = listProducts.map((prod) => {
        const lotesProcessed = prod.lotes.filter((l) =>
            l.status === 'Tratado' ? null : l
        );

        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            lotes: lotesProcessed,
        };
    });

    return resultsWithoutLotesProcessed;
}

// ESSA FUNÇÃO RECEBE UMA LISTA DE PRODUTOS E ORDERNAR CADA ARRAY DE LOTES DE CADA PRODUTO
// POR DATA DE VENCIMENTO, OU SEJA CADA PRODUTO DA LISTA VAI TER UM ARRAY DE LOTE JÁ ORDERNADO POR DATA DE VENCIMENTO
export function sortProductsLotesByLotesExpDate(listProducts) {
    const productsSorted = listProducts.map((prod) => {
        const prodLotesSorted = sortLoteByExpDate(prod.lotes);

        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            lotes: prodLotesSorted,
        };
    });

    return productsSorted;
}

// classifica os produtos em geral pelo o mais proximo de vencer
// ATENÇÃO QUE A FUNÇÃO SÓ PEGA O PRIMEIRO VALOR DO ARRAY DE LOTES, OU SEJA
// É ESPERADO QUE O ARRAY DE LOTES JÁ TENHA SIDO ORDERNADO ANTES
export function sortProductsByFisrtLoteExpDate(listProducts) {
    const results = listProducts.sort((item1, item2) => {
        if (item1.lotes[0].exp_date > item2.lotes[0].exp_date) return 1;
        if (item1.lotes[0].exp_date < item2.lotes[0].exp_date) return -1;
        return 0;
    });

    return results;
}
