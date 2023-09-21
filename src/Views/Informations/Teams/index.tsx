import React, { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import Share from 'react-native-share';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { generateBackup } from '@expirychecker/Utils/Backup/Generate';

import Header from '@components/Header';
import Button from '@components/Button';
import ActionButton from '@shared/Components/ActionButton';

import { Container, Content, Title, Advantage, Text } from './styles';

const Teams: React.FC = () => {
	const [isExporting, setIsExporting] = useState<boolean>(false);

	const handleExport = useCallback(async () => {
		try {
			setIsExporting(true);

			const path = await generateBackup();
			const filePath = `${path}/${strings.Function_Export_FileName}.cvbf`;

			await Share.open({
				title: strings.Function_Share_SaveFileTitle,
				url: `file://${filePath}`,
			});
		} catch (err) {
			if (err instanceof Error)
				showMessage({
					message: err.message,
					type: 'danger',
				});
		} finally {
			setIsExporting(false);
		}
	}, []);

	const handleNavigateGPlay = useCallback(async () => {
		await Linking.openURL(
			'https://play.google.com/store/apps/details?id=dev.douglasndm.expirychecker.business'
		);
	}, []);
	const handleNavigateAppStore = useCallback(async () => {
		await Linking.openURL(
			'https://apps.apple.com/us/app/validades-para-times/id1568936353'
		);
	}, []);

	return (
		<Container>
			<Header title={strings.Informations_Teams_PageTitle} noDrawer />

			<Content>
				<Title>{strings.Informations_Teams_InformationsTitle}</Title>
				<Advantage>
					{strings.Informations_Teams_AdvantagesTitle}
				</Advantage>

				<Text>{strings.Informations_Teams_Advantage1}</Text>

				<Text>{strings.Informations_Teams_Advantage2}</Text>

				<Text>{strings.Informations_Teams_Advantage3}</Text>

				<Text>{strings.Informations_Teams_Advantage4}</Text>

				<Text>{strings.Informations_Teams_AdvantageBackup}</Text>

				<Button
					text={strings.Informations_Teams_ButtonExport}
					isLoading={isExporting}
					onPress={handleExport}
				/>

				{Platform.OS === 'android' ? (
					<ActionButton
						iconName="logo-google-playstore"
						text={strings.Informations_Teams_ViewOnGooglePlay}
						onPress={handleNavigateGPlay}
					/>
				) : (
					<ActionButton
						iconName="logo-apple-appstore"
						text={strings.Informations_Teams_ViewOnAppStore}
						onPress={handleNavigateAppStore}
					/>
				)}
			</Content>
		</Container>
	);
};

export default Teams;
