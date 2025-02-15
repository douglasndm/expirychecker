import React, { useState, useCallback, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';
import {
	getStore,
	updateStore,
	deleteStore,
} from '@expirychecker/Functions/Stores';

import Header from '@components/Header';
import InputText from '@components/InputText';
import Dialog from '@components/Dialog';

import { Container, Content } from '@views/Store/Edit/styles';

interface Props {
	store_id: string;
}

const Edit: React.FC = () => {
	const [storeName, setStoreName] = useState<string>('');
	const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

	const { pop, popToTop } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const route = useRoute();
	const params = route.params as Props;

	const loadData = useCallback(async () => {
		try {
			const store = await getStore(params.store_id);

			if (store) {
				setStoreName(store.name);
			}
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [params.store_id]);

	const handleUpdate = useCallback(async () => {
		try {
			await updateStore({
				id: params.store_id,
				name: storeName,
			});

			showMessage({
				message: strings.View_Store_Edit_Alert_Success_UpdateStore,
				type: 'info',
			});

			pop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [params.store_id, pop, storeName]);

	const handleDelete = useCallback(async () => {
		try {
			await deleteStore(params.store_id);

			showMessage({
				message: strings.View_Store_Edit_Alert_Success_StoreDeleted,
				type: 'info',
			});

			popToTop();
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		}
	}, [params.store_id, popToTop]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleTextChange = useCallback((value: string) => {
		setStoreName(value);
	}, []);

	const handleSwitchShowDelete = useCallback(() => {
		setDeleteComponentVisible(prevState => !prevState);
	}, []);

	return (
		<Container>
			<Header
				title={strings.View_Store_Edit_PageTitle.replace(
					'{STORE}',
					storeName
				)}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleUpdate,
					},
				]}
				moreMenuItems={[
					{
						title: strings.View_ProductDetails_Button_DeleteProduct,
						leadingIcon: 'trash-can-outline',
						onPress: handleSwitchShowDelete,
					},
				]}
			/>

			<Content>
				<InputText
					placeholder={strings.View_Store_Edit_Placeholder_StoreName}
					value={storeName}
					onChangeText={handleTextChange}
				/>
			</Content>

			<Dialog
				visible={deleteComponentVisible}
				onDismiss={() => setDeleteComponentVisible(false)}
				onConfirm={handleDelete}
				title={strings.View_Store_Edit_Delete_title}
				description={strings.View_Store_Edit_Delete_Description.replace(
					'{STORE}',
					storeName
				)}
				confirmText={strings.View_Store_Edit_Delete_Button_Confirm}
				cancelText={strings.View_Store_Edit_Delete_Button_Cancel}
			/>
		</Container>
	);
};

export default Edit;
