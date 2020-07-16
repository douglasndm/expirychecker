export function sortLoteByExpDate(lotes) {
    // Não sei pq o certo mas o Realm transformou o array em uma coleção de objetos
    // e sendo objetos não consigo fazer o sort deles usando as funções nativas do javscript
    // solução -> percorrer todo o objeto de lotes e colocar cada um dentro de um array temporario
    // para ai sim ser possível fazer o sort
    const arrayTemp = lotes.map((l) => l);

    const lotesSorted = arrayTemp.sort((l1, l2) => {
        if (l1.exp_date > l2.exp_date) return 1;
        if (l1.exp_date < l2.exp_date) return -1;
        return 0;
    });

    return lotesSorted;
}
