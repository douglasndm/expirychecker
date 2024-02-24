import React, { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import remoteConfig from '@react-native-firebase/remote-config';
import DocumentPicker from 'react-native-document-picker';

import strings from '@expirychecker/Locales';

import { captureException } from '@services/ExceptionsHandler';

import { exportToExcel, generateEmptyExcel } from '@utils/Excel/Export';
import { importExcel } from '@expirychecker/Utils/Excel/Import';
import { getAllBrands } from '@expirychecker/Utils/Brands';
import { getAllCategories } from '@expirychecker/Utils/Categories/All';
import { getAllStores } from '@expirychecker/Utils/Stores/Find';
import { exportBackup } from '@expirychecker/Utils/Backup/Export';

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

	const getProducts = async () => getAllProducts({});

	const handleExportBackup = useCallback(async () => {
		try {
			setIsExporting(true);
			await exportBackup();
		} catch (err) {
			if (err instanceof Error) {
				if (!err.message.includes('User did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});

					captureException(err);
				}
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
				message: strings.View_Export_Excel_SuccessMessage,
				type: 'info',
			});
		} catch (err) {
			if (err instanceof Error) {
				if (!err.message.includes('User did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});

					captureException(err);
				}
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
				if (!DocumentPicker.isCancel(err)) {
					showMessage({
						message: err.message,
						type: 'danger',
					});

					captureException(err);
				}
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
				if (!DocumentPicker.isCancel(err)) {
					showMessage({
						message: err.message,
						type: 'danger',
					});

					if (__DEV__) {
						console.error(err);
					} else {
						captureException(err);
					}
				}
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
				if (!err.message.includes('User did not share')) {
					showMessage({
						message: err.message,
						type: 'danger',
					});

					captureException(err);
				}
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
								title={strings.View_Export_Button_ExportExcel}
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
								title={strings.View_Export_Button_ImportExcel}
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
								title={strings.View_Export_Button_ExportBackup}
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
								title={strings.View_Settings_Button_ImportFile}
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
