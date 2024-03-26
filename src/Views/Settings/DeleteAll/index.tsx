import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { deleteAllProducts } from '@expirychecker/Utils/Products/Delete';

import Header from '@components/Header';
import Button from '@components/Button';
import Dialog from '@components/Dialog';

import { Category, SettingDescription } from '@views/Settings/styles';

import { Container, Content } from './styles';

const DeleteAll: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [confirm2, setConfirm2] = useState(false);

	const handleSwitchConfirm1 = useCallback(() => {
		setConfirm2(prevState => !prevState);
	}, []);

	const handleCancelDialog2 = useCallback(() => {
		setConfirm2(false);
	}, []);

	const handleDeleteAll = useCallback(async () => {
		try {
			await deleteAllProducts();

			showMessage({
				message: strings.View_Settings_Advanced_DeleteAll_Success,
				type: 'success',
			});

			reset({
				index: 0,
				routes: [{ name: 'Home' }],
			});
		} catch (error) {
			if (error instanceof Error) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			}
		} finally {
			setConfirm2(false);
		}
	}, [reset]);

	return (
		<Container>
			<Header
				title={strings.View_Settings_Advanced_DeleteAll_Title}
				noDrawer
			/>

			<Content>
				<Category>
					<SettingDescription>
						{strings.View_Settings_Advanced_DeleteAll_Description}
					</SettingDescription>

					<Button
						title={strings.View_Settings_Advanced_DeleteAll_Button}
						onPress={handleSwitchConfirm1}
					/>
				</Category>
			</Content>

			<Dialog
				visible={confirm2}
				title={strings.View_Settings_Advanced_DeleteAll_Dialog2_Title}
				description={
					strings.View_Settings_Advanced_DeleteAll_Dialog2_Description
				}
				cancelText={
					strings.View_Settings_Advanced_DeleteAll_Dialog2_Button_Cancel
				}
				confirmText={
					strings.View_Settings_Advanced_DeleteAll_Dialog2_Button_Confirm
				}
				onConfirm={handleDeleteAll}
				onCancel={handleCancelDialog2}
				onDismiss={handleCancelDialog2}
			/>
		</Container>
	);
};

export default DeleteAll;
