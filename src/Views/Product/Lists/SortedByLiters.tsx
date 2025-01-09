import React, { useCallback } from 'react';

import strings from '@shared/Locales';

import { extractProductLiters } from '@utils/Product/Sort/Helpers';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';
import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';

import { sortProductsLotesByLotesExpDate } from '@expirychecker/Functions/Products';

import ListProducts from '@views/Product/List';

const SortedByLiters: React.FC = () => {
	const loadProducts = useCallback(async () => {
		const products = await getAllProductsAsync({});

		const filtedProducts = extractProductLiters(products);
		const sortedProducts = sortProductsLotesByLotesExpDate(filtedProducts);

		return sortedProducts;
	}, []);

	return (
		<ListProducts
			pageTitle={strings.View_List_Products_SortedByLiters}
			getProducts={loadProducts}
			getAllBrands={getAllBrands}
			getAllCategories={getAllCategories}
			getAllStores={getAllStores}
		/>
	);
};

export default SortedByLiters;
