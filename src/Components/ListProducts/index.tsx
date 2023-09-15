import React, { useCallback } from 'react';
import {
	FlatList,
	NativeScrollEvent,
	NativeSyntheticEvent,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { deleteManyProducts } from '@expirychecker/Utils/Products';

import ListProds from '@components/Product/List';

interface RequestProps {
	products: Array<IProduct>;
	isHome?: boolean;
	onRefresh?: () => void;
	isRefreshing?: boolean;
	listRef?: React.RefObject<FlatList<IProduct>>;
	onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const ListProducts: React.FC<RequestProps> = ({
	products,
	isHome,
	onRefresh,
	isRefreshing = false,
	listRef,
	onScroll,
}: RequestProps) => {
	const handleDeleteMany = useCallback(
		async (productsIds: number[] | string[]) => {
			try {
				const ids = productsIds.map(id => {
					return Number(id);
				});
				await deleteManyProducts({ productsIds: ids });

				if (onRefresh) {
					onRefresh();
				}

				showMessage({
					message:
						strings.ListProductsComponent_ProductsDeleted_Notification,
					type: 'info',
				});
			} catch (err) {
				if (err instanceof Error)
					showMessage({
						message: err.message,
						type: 'danger',
					});
			}
		},
		[onRefresh]
	);

	return (
		<ListProds
			products={products}
			showAllProductsButton={isHome}
			listRef={listRef}
			handleDeleteMany={handleDeleteMany}
			onScroll={onScroll}
			isRefreshing={isRefreshing}
			onRefresh={onRefresh}
		/>
	);
};

export default React.memo(ListProducts);
