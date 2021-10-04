import React, { useState, useCallback, useEffect } from 'react';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { exportBackupFile } from '~/Functions/Backup';
import { exportToExcel } from '~/Functions/Excel';
import { getAllCategories } from '~/Functions/Category';

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
    CategoryTitle,
    PickerContainer,
    Picker,
} from './styles';

const Export: React.FC = () => {
    const [checked, setChecked] = React.useState('created_at');

    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const [isExcelLoading, setIsExcelLoading] = useState<boolean>(false);
    const [isBackupLoading, setIsBackupLoading] = useState<boolean>(false);

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
                await exportToExcel({
                    sortBy: 'created_date',
                    category: selectedCategory,
                });
            } else {
                await exportToExcel({
                    sortBy: 'expire_date',
                    category: selectedCategory,
                });
            }

            showMessage({
                message: strings.View_Export_Excel_SuccessMessage,
                type: 'info',
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsExcelLoading(false);
        }
    }, [checked, selectedCategory]);

    const loadData = useCallback(async () => {
        const cats = await getAllCategories();

        const categoriesArray: Array<ICategoryItem> = [];

        cats.forEach(cat =>
            categoriesArray.push({
                key: cat.id,
                label: cat.name,
                value: cat.id,
            })
        );

        setCategories(categoriesArray);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const handleCategoryChange = useCallback(value => {
        setSelectedCategory(value);
    }, []);

    return (
        <Container>
            <Header title={strings.View_Export_PageTitle} />

            <Content>
                <ExportOptionContainer>
                    <ExportExplain>
                        {strings.View_Export_Explain_Excel}
                    </ExportExplain>
                    <RadioButtonGroupContainer>
                        <SortTitle>{strings.View_Export_SortTitle}</SortTitle>
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

                    <CategoryTitle>
                        {strings.View_Export_Excel_CategoriesTitle}
                    </CategoryTitle>

                    <PickerContainer style={{ marginBottom: 10 }}>
                        <Picker
                            items={categories}
                            onValueChange={handleCategoryChange}
                            value={selectedCategory}
                            placeholder={{
                                label: strings.View_Export_Excel_Categorias_All,
                                value: 'null',
                            }}
                        />
                    </PickerContainer>

                    <Button
                        text={strings.View_Export_Button_ExportExcel}
                        onPress={handleExportToExcel}
                        isLoading={isExcelLoading}
                    />
                </ExportOptionContainer>

                <ExportOptionContainer>
                    <ExportExplain>
                        {strings.View_Export_Explain_Backup}
                    </ExportExplain>
                    <Button
                        text={strings.View_Export_Button_ExportBackup}
                        onPress={handleExportBackup}
                        isLoading={isBackupLoading}
                    />
                </ExportOptionContainer>
            </Content>
        </Container>
    );
};

export default Export;
