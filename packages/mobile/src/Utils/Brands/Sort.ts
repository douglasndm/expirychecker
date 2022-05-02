function sortBrands(brands: IBrand[]): IBrand[] {
    const sorted = brands.sort((b1, b2) => {
        const b1name = b1.name.trim().toLowerCase();
        const b2name = b2.name.trim().toLowerCase();

        if (b1name < b2name) {
            return -1;
        }
        if (b1name > b2name) {
            return 1;
        }
        return 0;
    });

    return sorted;
}

export { sortBrands };
