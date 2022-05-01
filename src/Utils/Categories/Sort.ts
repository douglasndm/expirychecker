function sortCategories(categories: ICategory[]): ICategory[] {
    const sorted = categories.sort((c1, c2) => {
        const c1name = c1.name.trim().toLowerCase();
        const c2name = c2.name.trim().toLowerCase();

        if (c1name < c2name) {
            return -1;
        }
        if (c1name > c2name) {
            return 1;
        }
        return 0;
    });

    return sorted;
}

export { sortCategories };
