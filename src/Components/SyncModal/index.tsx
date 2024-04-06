import React, { useState, useCallback } from 'react';
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
	Header,
	CloseButtonContainer,
	CloseButton,
	Content,
	Title,
	Description,
	ChooseContainer,
	ChooseText,
	CardContainer,
	Card,
	Icon,
} from './styles';

interface SyncModalProps {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
}

const SyncModal: React.FC<SyncModalProps> = (props: SyncModalProps) => {
	const { showModal, setShowModal } = props;

	const [isSyncing, setIsSyncing] = useState<boolean>(false);

	const [chosenOption, setChosenOption] =
		useState<InitalSyncProps>('keepBothData');

	const handleConfirm = useCallback(async () => {
		try {
			setIsSyncing(true);
			await initialSync(chosenOption);

			await AsyncStorage.setItem('initialSync', 'true');
			setShowModal(false);
		} catch (error) {
			if (error instanceof Error) {
				showMessage({
					message: error.message,
					type: 'danger',
				});
			}
		} finally {
			setIsSyncing(false);
		}
	}, [chosenOption, setShowModal]);

	return (
		<Modal animationType="slide" transparent={false} visible={showModal}>
			<Container>
				<Header>
					<CloseButtonContainer>
						<CloseButton
							name="close-outline"
							onPress={() => setShowModal(false)}
						/>
					</CloseButtonContainer>
				</Header>
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
						isLoading={isSyncing}
					/>
				</Content>
			</Container>
		</Modal>
	);
};

export default SyncModal;
