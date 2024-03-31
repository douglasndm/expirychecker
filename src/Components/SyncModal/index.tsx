import React, { useState, useEffect, useCallback } from 'react';
import { Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import {
	initialSync,
	InitalSyncProps,
} from '@expirychecker/Utils/Database/Sync/Firestore';

import Button from '@components/Button';

import {
	Container,
	Content,
	Title,
	Description,
	ChooseContainer,
	ChooseText,
	CardContainer,
	Card,
	Icon,
} from './styles';

const SyncModal: React.FC = () => {
	const [isModalVisible, setModalVisible] = useState(false);

	const [chosenOption, setChosenOption] =
		useState<InitalSyncProps>('keepBothData');

	const loadData = useCallback(async () => {
		const initialSyncDone = await AsyncStorage.getItem('initialSync');

		if (!initialSyncDone) {
			setModalVisible(true);
			return;
		}

		setModalVisible(false);
	}, []);

	const handleConfirm = useCallback(async () => {
		try {
			await initialSync(chosenOption);

			await AsyncStorage.setItem('initialSync', 'true');
			setModalVisible(false);
		} catch (error) {
			if (error instanceof Error) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			}
		}
	}, [chosenOption]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return (
		<Modal
			animationType="slide"
			transparent={false}
			visible={isModalVisible}
		>
			<Container>
				<Content>
					<Title>{strings.Component_InitalSync_PageTitle}</Title>

					{chosenOption === 'deleteFirestoreData' && (
						<ScrollView>
							<Description>
								{
									strings.Component_InitalSync_Option1_Description
								}
							</Description>
						</ScrollView>
					)}

					{chosenOption === 'deleteRealmData' && (
						<ScrollView>
							<Description>
								{
									strings.Component_InitalSync_Option2_Description
								}
							</Description>
						</ScrollView>
					)}

					{chosenOption === 'keepBothData' && (
						<ScrollView>
							<Description>
								{
									strings.Component_InitalSync_Option3_Description
								}
							</Description>
						</ScrollView>
					)}

					<ChooseContainer>
						{chosenOption === 'deleteFirestoreData' && (
							<ChooseText>
								{strings.Component_InitalSync_Option1_Title}
							</ChooseText>
						)}
						{chosenOption === 'deleteRealmData' && (
							<ChooseText>
								{strings.Component_InitalSync_Option2_Title}
							</ChooseText>
						)}
						{chosenOption === 'keepBothData' && (
							<ChooseText>
								{strings.Component_InitalSync_Option3_Title}
							</ChooseText>
						)}
						<CardContainer>
							<Card
								selected={chosenOption === 'keepBothData'}
								onPress={() => setChosenOption('keepBothData')}
							>
								<Icon name="sync-outline" />
							</Card>

							<Card
								selected={
									chosenOption === 'deleteFirestoreData'
								}
								onPress={() =>
									setChosenOption('deleteFirestoreData')
								}
							>
								<Icon name="phone-portrait-outline" />
							</Card>

							<Card
								selected={chosenOption === 'deleteRealmData'}
								onPress={() =>
									setChosenOption('deleteRealmData')
								}
							>
								<Icon name="cloud-outline" />
							</Card>
						</CardContainer>
					</ChooseContainer>

					<Button
						title={strings.Component_InitalSync_Button_Sync}
						onPress={handleConfirm}
					/>
				</Content>
			</Container>
		</Modal>
	);
};

export default SyncModal;
