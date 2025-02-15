import React, { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '@shared/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { exportToExcel, generateEmptyExcel } from '@utils/Excel/Export';
import { exportProductsToXML } from '@utils/IO/Export/XML';

import { importExcel } from '@expirychecker/Utils/Excel/Import';
import { getAllBrands } from '@expirychecker/Utils/Brands/All';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import { exportBackup } from '@expirychecker/Utils/Backup/Export';
import { exportToTeams } from '@expirychecker/Utils/Backup/Teams';

import { getAllProductsAsync } from '@expirychecker/Utils/Products/All';
import { getAllProducts } from '@expirychecker/Functions/Products';

import { importBackupFile } from '@expirychecker/Functions/Backup';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	Content,
	ExportOptionContainer,
	ExportExplain,
	CategoryTitle,
	LinkEmptyExcel,
	Loading,
} from '@views/Export/styles';

const Export: React.FC = () => {
	const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);
	const [isExcelImporting, setIsExcelImporting] = useState<boolean>(false);
	const [isExcelModelGenerating, setIsExcelModelGenerating] =
		useState<boolean>(false);

	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [isImporting, setIsImporting] = useState<boolean>(false);

	const [isXMLExporting, setIsXMLExporting] = useState<boolean>(false);

	const [isTeamsExporting, setIsTeamsExporting] = useState<boolean>(false);

	const getProducts = async () => getAllProducts({});

	const handleExportBackup = useCallback(async () => {
		try {
			setIsExporting(true);
			await exportBackup();

			showMessage({
				message: strings.baseApp.View_Export_Export_Alert_Success,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsExporting(false);
		}
	}, []);

	const handleExportToExcel = useCallback(async () => {
		try {
			setIsExcelLoading(true);

			await exportToExcel({
				getProducts,
				getBrands: getAllBrands,
				getCategories: getAllCategories,
				getStores: getAllStores,
			});

			showMessage({
				message: strings.baseApp.View_Export_Excel_Export_Alert_Success,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsExcelLoading(false);
		}
	}, []);

	const handleImportExcel = useCallback(async () => {
		try {
			setIsExcelImporting(true);

			await importExcel();

			showMessage({
				message: strings.baseApp.View_Export_Excel_Import_Alert_Success,
				type: 'info',
			});
			reset({
				routes: [{ name: 'Home' }],
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsExcelImporting(false);
		}
	}, [reset]);

	const handleImportBackup = useCallback(async () => {
		try {
			setIsImporting(true);

			const result = await importBackupFile();

			if (result === true) {
				showMessage({
					message: strings.baseApp.View_Export_Import_Alert_Success,
					type: 'info',
				});
				reset({
					routes: [{ name: 'Home' }],
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsImporting(false);
		}
	}, [reset]);

	const handleExcelModelGenerete = useCallback(async () => {
		try {
			setIsExcelModelGenerating(true);

			await generateEmptyExcel();

			showMessage({
				message:
					strings.baseApp
						.View_Export_Excel_Export_Model_Alert_Success,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsExcelModelGenerating(false);
		}
	}, []);

	const handleExportXML = useCallback(async () => {
		try {
			setIsXMLExporting(true);

			const allProducts = await getAllProductsAsync({
				sortProductsByExpDate: true,
			});

			const allBrands = await getAllBrands();
			const allCategories = await getAllCategories();
			const allStores = await getAllStores();

			await exportProductsToXML({
				products: allProducts,
				brands: allBrands,
				categories: allCategories,
				stores: allStores,
			});

			showMessage({
				message: strings.View_Export_XML_SuccessMessage,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsXMLExporting(false);
		}
	}, []);

	const handleGoToXMLDocumentation = useCallback(() => {
		Linking.openURL(
			'https://controledevalidades.com/integrando-o-controle-de-validades-com-outros-sistemas-via-xml/'
		);
	}, []);

	const handleExportTeams = useCallback(async () => {
		try {
			setIsTeamsExporting(true);

			await exportToTeams();

			showMessage({
				message: strings.baseApp.View_Export_Teams_Alert_Success,
				type: 'info',
			});
		} catch (error) {
			if (error instanceof Error) {
				captureException({ error });
			}
		} finally {
			setIsTeamsExporting(false);
		}
	}, []);

	return (
		<Container>
			<Header title={strings.View_Export_PageTitle} noDrawer />

			<Content>
				<ExportOptionContainer>
					<CategoryTitle>Excel</CategoryTitle>

					<ExportExplain>
						{strings.View_Export_Explain_Excel}
					</ExportExplain>

					<Button
						title={strings.View_Export_Button_ExportExcel}
						onPress={handleExportToExcel}
						isLoading={isExcelLoading}
					/>

					<ExportExplain>
						{strings.View_Export_Import_Excel}
					</ExportExplain>

					<Button
						title={strings.View_Export_Button_ImportExcel}
						onPress={handleImportExcel}
						isLoading={isExcelImporting}
					/>

					{isExcelModelGenerating ? (
						<Loading />
					) : (
						<LinkEmptyExcel onPress={handleExcelModelGenerete}>
							{strings.View_Export_Excel_GenerateEmptyExcel}
						</LinkEmptyExcel>
					)}
				</ExportOptionContainer>

				<ExportOptionContainer>
					<CategoryTitle>Backup</CategoryTitle>

					<ExportExplain>
						{strings.View_Export_Explain_Backup}
					</ExportExplain>
					<Button
						title={strings.View_Export_Button_ExportBackup}
						onPress={handleExportBackup}
						isLoading={isExporting}
					/>

					<ExportExplain>
						{strings.View_Settings_SettingName_ExportAndInmport}
					</ExportExplain>
					<Button
						title={strings.View_Settings_Button_ImportFile}
						onPress={handleImportBackup}
						isLoading={isImporting}
					/>
				</ExportOptionContainer>

				<ExportOptionContainer>
					<CategoryTitle>XML</CategoryTitle>

					<>
						<ExportExplain>
							{strings.View_Export_XML_Explain_Export}
						</ExportExplain>
						<Button
							title={strings.View_Export_XML_Button_Export}
							onPress={handleExportXML}
							isLoading={isXMLExporting}
						/>

						<LinkEmptyExcel onPress={handleGoToXMLDocumentation}>
							{strings.View_Export_XML_Link_Documentation}
						</LinkEmptyExcel>
					</>
				</ExportOptionContainer>

				<ExportOptionContainer>
					<CategoryTitle>
						{strings.baseApp.View_Export_Teams_Title}
					</CategoryTitle>
					<ExportExplain>
						{strings.baseApp.View_Export_Teams_Description}
					</ExportExplain>
					<Button
						title={strings.baseApp.View_Export_Teams_Export_Button}
						onPress={handleExportTeams}
						isLoading={isTeamsExporting}
					/>
				</ExportOptionContainer>

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default Export;
