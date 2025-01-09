import React, { useCallback } from 'react';

import strings from '@shared/Locales';

import { extractProductWeight } from '@utils/Product/Sort/Helpers';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';
import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';

import { sortProductsLotesByLotesExpDate } from '@expirychecker/Functions/Products';

import ListProducts from '@views/Product/List';

const SortedByWeight: React.FC = () => {
	const loadProducts = useCallback(async () => {
		const products = await getAllProductsAsync({});

		const filtedProducts = extractProductWeight(products);
		const sortedProducts = sortProductsLotesByLotesExpDate(filtedProducts);

		return sortedProducts;
	}, []);

	return (
		<ListProducts
			pageTitle={strings.View_List_Products_SortedByWeight}
			getProducts={loadProducts}
			getAllBrands={getAllBrands}
			getAllCategories={getAllCategories}
			getAllStores={getAllStores}
		/>
	);
};

export default SortedByWeight;
