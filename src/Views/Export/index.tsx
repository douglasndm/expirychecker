import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import remoteConfig from '@react-native-firebase/remote-config';

import strings from '@expirychecker/Locales';

import { exportToExcel } from '@utils/Excel/Export';
import { importExcel } from '@expirychecker/Utils/Excel/Import';
import { generateEmptyExcel } from '@expirychecker/Utils/Excel/Export';
import { getAllBrands } from '@expirychecker/Utils/Brands';

import { getAllProducts } from '@expirychecker/Functions/Products';
import { getAllCategories } from '@expirychecker/Functions/Category';
import { getAllStores } from '@expirychecker/Functions/Stores';

import {
	exportBackupFile,
	importBackupFile,
} from '@expirychecker/Functions/Backup';

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

	const enableExcelImport = remoteConfig().getValue('enable_excel_import');
	const enableExcelExport = remoteConfig().getValue('enable_excel_export');
	const enableBackupImport = remoteConfig().getValue('enable_backup_import');
	const enableBackupExport = remoteConfig().getValue('enable_backup_export');

	const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);
	const [isExcelImporting, setIsExcelImporting] = useState<boolean>(false);
	const [isExcelModelGenerating, setIsExcelModelGenerating] =
		useState<boolean>(false);

	const [isExporting, setIsExporting] = useState<boolean>(false);
	const [isImporting, setIsImporting] = useState<boolean>(false);

	const handleExportBackup = useCallback(async () => {
		try {
			setIsExporting(true);
			await exportBackupFile();
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsExporting(false);
		}
	}, []);

	const getProducts = async () => getAllProducts({});

	const handleExportToExcel = useCallback(async () => {
		try {
			setIsExcelLoading(true);

			await exportToExcel({
				sortBy: 'expire_date',
				getProducts,
				getBrands: getAllBrands,
				getCategories: getAllCategories,
				getStores: getAllStores,
			});

			showMessage({
				message: strings.View_Export_Excel_SuccessMessage,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error)
				if (!err.message.includes('did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});
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
				message: strings.View_Settings_Backup_Import_Alert_Sucess,
				type: 'info',
			});
			reset({
				routes: [{ name: 'Home' }],
			});
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsExcelImporting(false);
		}
	}, [reset]);

	const handleImportBackup = useCallback(async () => {
		try {
			setIsImporting(true);

			await importBackupFile();

			showMessage({
				message: strings.View_Settings_Backup_Import_Alert_Sucess,
				type: 'info',
			});
			reset({
				routes: [{ name: 'Home' }],
			});
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsImporting(false);
		}
	}, [reset]);

	const handleExcelModelGenerete = useCallback(async () => {
		try {
			setIsExcelModelGenerating(true);

			await generateEmptyExcel();
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		} finally {
			setIsExcelModelGenerating(false);
		}
	}, []);

	return (
		<Container>
			<Header title={strings.View_Export_PageTitle} noDrawer />

			<Content>
				<ExportOptionContainer>
					<CategoryTitle>Excel</CategoryTitle>

					{enableExcelExport.asBoolean() === true && (
						<>
							<ExportExplain>
								{strings.View_Export_Explain_Excel}
							</ExportExplain>

							<Button
								text={strings.View_Export_Button_ExportExcel}
								onPress={handleExportToExcel}
								isLoading={isExcelLoading}
							/>
						</>
					)}

					{enableExcelImport.asBoolean() === true && (
						<>
							<ExportExplain>
								{strings.View_Export_Import_Excel}
							</ExportExplain>

							<Button
								text={strings.View_Export_Button_ImportExcel}
								onPress={handleImportExcel}
								isLoading={isExcelImporting}
							/>

							{isExcelModelGenerating ? (
								<Loading />
							) : (
								<LinkEmptyExcel
									onPress={handleExcelModelGenerete}
								>
									{
										strings.View_Export_Excel_GenerateEmptyExcel
									}
								</LinkEmptyExcel>
							)}
						</>
					)}
				</ExportOptionContainer>

				<ExportOptionContainer>
					<CategoryTitle>Backup</CategoryTitle>

					{enableBackupExport.asBoolean() === true && (
						<>
							<ExportExplain>
								{strings.View_Export_Explain_Backup}
							</ExportExplain>
							<Button
								text={strings.View_Export_Button_ExportBackup}
								onPress={handleExportBackup}
								isLoading={isExporting}
							/>
						</>
					)}

					{enableBackupImport.asBoolean() === true && (
						<>
							<ExportExplain>
								{
									strings.View_Settings_SettingName_ExportAndInmport
								}
							</ExportExplain>
							<Button
								text={strings.View_Settings_Button_ImportFile}
								onPress={handleImportBackup}
								isLoading={isImporting}
							/>
						</>
					)}
				</ExportOptionContainer>

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default Export;
