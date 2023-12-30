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

	const [confirm, setConfirm] = useState(false);
	const [confirm2, setConfirm2] = useState(false);

	const handleSwitchConfirm1 = useCallback(() => {
		setConfirm(prevState => !prevState);
	}, []);

	const handleSwitchConfirm2 = useCallback(() => {
		setConfirm(false);
		setConfirm2(prevState => !prevState);
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
			setConfirm(false);
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
				visible={confirm}
				title={strings.View_Settings_Advanced_DeleteAll_Dialog1_Title}
				description={
					strings.View_Settings_Advanced_DeleteAll_Dialog1_Description
				}
				cancelText={
					strings.View_Settings_Advanced_DeleteAll_Dialog1_Button_Cancel
				}
				confirmText={
					strings.View_Settings_Advanced_DeleteAll_Dialog1_Button_Confirm
				}
				onConfirm={handleSwitchConfirm2}
				onCancel={handleSwitchConfirm1}
				onDismiss={handleSwitchConfirm1}
			/>

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
				onCancel={handleSwitchConfirm2}
				onDismiss={handleSwitchConfirm2}
			/>
		</Container>
	);
};

export default DeleteAll;
