import React, { useState, useCallback, useContext, useEffect } from 'react';
import Share from 'react-native-share';
import { showMessage } from 'react-native-flash-message';

import { translate } from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { exportBackupFile, generateBackupFile } from '~/Functions/Backup';
import { exportToExcel } from '~/Functions/Excel';
import { getAllStores } from '~/Functions/Stores';

import Header from '~/Components/Header';
import Button from '~/Components/Button';

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
    PickerContainer,
    Picker,
} from './styles';

interface IStoreItem {
    label: string;
    value: string;
    key: string;
}

const Export: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

    const [checked, setChecked] = React.useState('created_at');

    const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);
    const [isBackupLoading, setIsBackupLoading] = useState<boolean>(false);
    const [isBusinessLoading, setIsBusinessLoading] = useState<boolean>(false);

    const [selectedStore, setSelectedStore] = useState<string>(() => {
        return 'none';
    });

    const [stores, setStores] = useState<Array<IStoreItem>>([]);

    const loadata = useCallback(async () => {
        const allStores = await getAllStores();

        const storesArray: Array<IStoreItem> = [];

        allStores.forEach(sto => {
            if (sto.id) {
                storesArray.push({
                    key: sto.id,
                    label: sto.name,
                    value: sto.id,
                });
            }
        });

        storesArray.push({
            key: 'none',
            label: translate('View_Export_StorePicker_NoStore'),
            value: 'none',
        });

        setStores(storesArray);
    }, []);

    const handleExportBackup = useCallback(async () => {
        try {
            setIsBackupLoading(true);
            await exportBackupFile();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsBackupLoading(false);
        }
    }, []);

    const handleExportToExcel = useCallback(async () => {
        try {
            setIsExcelLoading(true);

            if (checked === 'created_at') {
                await exportToExcel({ sortBy: 'created_date' });
            } else {
                await exportToExcel({ sortBy: 'expire_date' });
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsExcelLoading(false);
        }
    }, [checked]);

    const handleExportBusiness = useCallback(async () => {
        try {
            setIsBusinessLoading(true);

            const path = await generateBackupFile({
                includeCategories: true,
                store: selectedStore || 'none',
            });
            await Share.open({
                title: translate('Function_Share_SaveFileTitle'),
                url: `file://${path}`,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsBusinessLoading(false);
        }
    }, [selectedStore]);

    const handleStoreChange = useCallback(value => {
        setSelectedStore(value);
    }, []);

    useEffect(() => {
        loadata();
    }, [loadata]);
    return (
        <Container>
            <Header title={translate('View_Export_PageTitle')} />

            <Content>
                <ExportOptionContainer>
                    <ExportExplain>
                        {translate('View_Export_Explain_Excel')}
                    </ExportExplain>
                    <RadioButtonGroupContainer>
                        <SortTitle>
                            {translate('View_Export_SortTitle')}
                        </SortTitle>
                        <RadioButtonContainer>
                            <RadioButtonText>
                                {translate('View_Export_SortByCreatedDate')}
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
                                {translate('View_Export_SortByExpireDate')}
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
                        text={translate('View_Export_Button_ExportExcel')}
                        onPress={handleExportToExcel}
                        isLoading={isExcelLoading}
                    />
                </ExportOptionContainer>

                <ExportOptionContainer>
                    <ExportExplain>
                        {translate('View_Export_Explain_Backup')}
                    </ExportExplain>
                    <Button
                        text={translate('View_Export_Button_ExportBackup')}
                        onPress={handleExportBackup}
                        isLoading={isBackupLoading}
                    />
                </ExportOptionContainer>

                <ExportOptionContainer>
                    <ExportExplain>
                        {translate('View_Export_Explain_Business')}
                    </ExportExplain>

                    {userPreferences.multiplesStores && (
                        <PickerContainer
                            style={{
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                        >
                            <Picker
                                items={stores}
                                onValueChange={handleStoreChange}
                                value={selectedStore}
                                placeholder={{
                                    label: translate(
                                        'View_AddProduct_InputPlacehoder_Store'
                                    ),
                                    value: 'null',
                                }}
                            />
                        </PickerContainer>
                    )}

                    <Button
                        text={translate('View_Export_Button_Business')}
                        onPress={handleExportBusiness}
                        isLoading={isBusinessLoading}
                    />
                </ExportOptionContainer>
            </Content>
        </Container>
    );
};

export default Export;
