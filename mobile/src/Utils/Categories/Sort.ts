function sortCategories(categories: ICategory[]): ICategory[] {
    const sorted = categories.sort((b1, b2) => {
        if (b1.name < b2.name) {
            return -1;
        }
        if (b1.name > b2.name) {
            return 1;
        }
        return 0;
    });

    return sorted;
}

export { sortCategories };
