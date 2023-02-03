import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Dialog from 'react-native-dialog';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { deleteManyProducts } from '@expirychecker/Utils/Products';

import { sortByBatchesExpType } from '@expirychecker/Functions/Products/SortBatches';

import GenericButton from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import ProductItem from './ProductContainer';

import {
	Container,
	ActionButtonsContainer,
	ProductContainer,
	SelectButtonContainer,
	SelectButton,
	SelectIcon,
	ButtonPaper,
	EmptyListText,
	InvisibleComponent,
	Icons,
} from './styles';

interface RequestProps {
	products: Array<IProduct>;
	isHome?: boolean;
	onRefresh?: () => void;
	isRefreshing?: boolean;
	listRef?: React.RefObject<FlatList<IProduct>>;
}

const ListProducts: React.FC<RequestProps> = ({
	products,
	isHome,
	onRefresh,
	isRefreshing = false,
	listRef,
}: RequestProps) => {
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [sortedProducts, setSortedProducts] = useState<IProduct[]>([]);

	const [limitedProducts, setLimitedProducts] = useState<IProduct[]>([]);
	const [page, setPage] = useState(0);

	const [selectedProds, setSelectedProds] = useState<Array<number>>([]);
	const [selectMode, setSelectMode] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const { userPreferences } = useContext(PreferencesContext);

	const handleSortProducts = useCallback(async () => {
		const temp = await sortByBatchesExpType(products);

		const tempArray: IProduct[] = [];

		temp.expired.forEach(item => tempArray.push(item));
		temp.nextToExp.forEach(item => tempArray.push(item));
		temp.normal.forEach(item => tempArray.push(item));

		setSortedProducts(tempArray);
		setPage(1);
	}, [products]);

	useEffect(() => {
		setLimitedProducts(sortedProducts.slice(0, 10));
	}, [sortedProducts]);

	useEffect(() => {
		handleSortProducts();
	}, [handleSortProducts]);

	const loadMoreProducts = useCallback(() => {
		const nextPage = page + 1;

		setLimitedProducts(sortedProducts.slice(0, 10 * nextPage));

		setPage(nextPage);
	}, [page, sortedProducts]);

	const handleNavigateToAllProducts = useCallback(() => {
		navigate('AllProducts');
	}, [navigate]);

	const switchSelectedItem = useCallback(
		(productId: number) => {
			const isChecked = selectedProds.find(id => id === productId);

			if (!isChecked) {
				const prodsIds = [...selectedProds, productId];

				setSelectedProds(prodsIds);
				return;
			}

			const newSelected = selectedProds.filter(id => id !== productId);
			setSelectedProds(newSelected);
		},
		[selectedProds]
	);

	const handleEnableSelectMode = useCallback(() => {
		if (userPreferences.isPRO) setSelectMode(true);
	}, [userPreferences.isPRO]);

	const handleDisableSelectMode = useCallback(() => {
		setSelectMode(false);
	}, []);

	const EmptyList = useCallback(() => {
		return (
			<EmptyListText>
				{strings.ListProductsComponent_Title_NoProductsInList}
			</EmptyListText>
		);
	}, []);

	const FooterButton = useCallback(() => {
		if (products.length > 5 && isHome) {
			return (
				<>
					<GenericButton
						text={
							strings.ListProductsComponent_Button_ShowAllProducts
						}
						onPress={handleNavigateToAllProducts}
					/>
					<PaddingComponent />
				</>
			);
		}

		return <InvisibleComponent />;
	}, [products.length, isHome, handleNavigateToAllProducts]);

	const renderComponent = useCallback(
		({ item, index }) => {
			const product: IProduct = item as IProduct;

			const isChecked = selectedProds.find(id => id === product.id);

			return (
				<ProductContainer onLongPress={handleEnableSelectMode}>
					{selectMode && (
						<SelectButtonContainer>
							<SelectButton
								onPress={() => switchSelectedItem(product.id)}
							>
								{isChecked ? (
									<SelectIcon name="checkmark-circle-outline" />
								) : (
									<SelectIcon name="ellipse-outline" />
								)}
							</SelectButton>
						</SelectButtonContainer>
					)}
					<ProductItem
						product={product}
						index={index}
						handleEnableSelect={handleEnableSelectMode}
					/>
				</ProductContainer>
			);
		},
		[handleEnableSelectMode, selectMode, selectedProds, switchSelectedItem]
	);

	const handleSwitchDeleteModal = useCallback(() => {
		setDeleteModal(!deleteModal);
	}, [deleteModal]);

	const handleDeleteMany = useCallback(async () => {
		if (selectedProds.length <= 0) {
			handleDisableSelectMode();
			setDeleteModal(false);
			return;
		}
		try {
			await deleteManyProducts({ productsIds: selectedProds });

			if (onRefresh) {
				onRefresh();
			}

			showMessage({
				message:
					strings.ListProductsComponent_ProductsDeleted_Notification,
				type: 'info',
			});

			setDeleteModal(false);
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [handleDisableSelectMode, onRefresh, selectedProds]);

	return (
		<Container>
			{selectMode && userPreferences.isPRO && (
				<ActionButtonsContainer>
					<ButtonPaper
						icon={() => <Icons name="trash-outline" />}
						onPress={handleSwitchDeleteModal}
					>
						{
							strings.ListProductsComponent_DeleteProducts_ActionBar_DeleteSelected
						}
					</ButtonPaper>

					<ButtonPaper
						icon={() => <Icons name="exit-outline" />}
						onPress={handleDisableSelectMode}
					>
						{
							strings.ListProductsComponent_DeleteProducts_ActionBar_Cancel
						}
					</ButtonPaper>
				</ActionButtonsContainer>
			)}
			<FlatList
				ref={listRef}
				data={limitedProducts}
				keyExtractor={item => String(item.id)}
				renderItem={renderComponent}
				ListEmptyComponent={EmptyList}
				ListFooterComponent={FooterButton}
				onRefresh={onRefresh}
				refreshing={isRefreshing}
				onEndReached={loadMoreProducts}
				onEndReachedThreshold={0.5}
			/>

			<Dialog.Container
				visible={deleteModal}
				onBackdropPress={handleSwitchDeleteModal}
			>
				<Dialog.Title>
					{strings.ListProductsComponent_DeleteProducts_Modal_Title}
				</Dialog.Title>
				<Dialog.Description>
					{
						strings.ListProductsComponent_DeleteProducts_Modal_Description
					}
				</Dialog.Description>
				<Dialog.Button
					label={
						strings.ListProductsComponent_DeleteProducts_Modal_Button_Keep
					}
					onPress={handleSwitchDeleteModal}
				/>
				<Dialog.Button
					label={
						strings.ListProductsComponent_DeleteProducts_Modal_Button_Delete
					}
					color="red"
					onPress={handleDeleteMany}
				/>
			</Dialog.Container>
		</Container>
	);
};

export default ListProducts;
