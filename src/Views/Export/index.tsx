import React, { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import RNPermissions from 'react-native-permissions';
import remoteConfig from '@react-native-firebase/remote-config';

import strings from '~/Locales';

import { importExcel } from '~/Utils/Excel/Import';
import { exportToExcel, generateEmptyExcel } from '~/Utils/Excel/Export';

import { exportBackupFile, importBackupFile } from '~/Functions/Backup';

import Header from '@components/Header';
import Button from '@components/Button';
import PaddingComponent from '~/Components/PaddingComponent';

import {
    Container,
    Content,
    ExportOptionContainer,
    ExportExplain,
    RadioButtonGroupContainer,
    SortTitle,
    RadioButtonContainer,
    RadioButton,
    RadioButtonText,
    CategoryTitle,
    LinkEmptyExcel,
    Loading,
} from './styles';

const Export: React.FC = () => {
    const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

    const enableExcelImport = remoteConfig().getValue('enable_excel_import');
    const enableExcelExport = remoteConfig().getValue('enable_excel_export');
    const enableBackupImport = remoteConfig().getValue('enable_backup_import');
    const enableBackupExport = remoteConfig().getValue('enable_backup_export');

    const [checked, setChecked] = React.useState('created_at');

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

    const handleExportToExcel = useCallback(async () => {
        try {
            setIsExcelLoading(true);

            if (checked === 'created_at') {
                await exportToExcel({
                    sortBy: 'created_date',
                });
            } else {
                await exportToExcel({
                    sortBy: 'expire_date',
                });
            }

            showMessage({
                message: strings.View_Export_Excel_SuccessMessage,
                type: 'info',
            });
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsExcelLoading(false);
        }
    }, [checked]);

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
    }, []);

    const handleImportBackup = useCallback(async () => {
        try {
            setIsImporting(true);

            if (Platform.OS === 'android') {
                const isReadFileAllow = await RNPermissions.check(
                    RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                );
                if (isReadFileAllow !== 'granted') {
                    const granted = await RNPermissions.request(
                        RNPermissions.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                    );

                    if (granted !== 'granted') {
                        throw new Error('Permission denided');
                    }
                }
            }

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
    }, []);

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
                            <RadioButtonGroupContainer>
                                <SortTitle>
                                    {strings.View_Export_SortTitle}
                                </SortTitle>
                                <RadioButtonContainer>
                                    <RadioButtonText>
                                        {strings.View_Export_SortByCreatedDate}
                                    </RadioButtonText>
                                    <RadioButton
                                        value="created_at"
                                        status={
                                            checked === 'created_at'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('created_at')}
                                    />
                                </RadioButtonContainer>

                                <RadioButtonContainer>
                                    <RadioButtonText>
                                        {strings.View_Export_SortByExpireDate}
                                    </RadioButtonText>
                                    <RadioButton
                                        value="expire_in"
                                        status={
                                            checked === 'expire_in'
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                        onPress={() => setChecked('expire_in')}
                                    />
                                </RadioButtonContainer>
                            </RadioButtonGroupContainer>

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
