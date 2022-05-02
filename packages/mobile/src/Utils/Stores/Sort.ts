function sortStores(stores: IStore[]): IStore[] {
    const sorted = stores.sort((s1, s2) => {
        const s1name = s1.name.trim().toLowerCase();
        const s2name = s2.name.trim().toLowerCase();

        if (s1name < s2name) {
            return -1;
        }
        if (s1name > s2name) {
            return 1;
        }
        return 0;
    });

    return sorted;
}

export { sortStores };
