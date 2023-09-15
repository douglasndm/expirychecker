// Remove products from list without batches
function removeProductsWithoutBatchesFromList(
	products: IProduct[]
): IProduct[] {
	return products.filter(p => p.batches.length > 0);
}

// Remove thrated batches from list
function removeTreatedBatchesFromList(products: IProduct[]): IProduct[] {
	const prodsWithNonThreatedBatches = products.map(product => {
		const batches = product.batches.filter(
			batch => batch.status !== 'Tratado'
		);

		const prod: IProduct = {
			id: product.id,
			name: product.name,
			code: product.code,
			store: product.store,
			photo: product.photo,
			daysToBeNext: product.daysToBeNext,
			categories: product.categories,
			batches,
		};

		return prod;
	});

	return prodsWithNonThreatedBatches;
}

export { removeProductsWithoutBatchesFromList, removeTreatedBatchesFromList };
