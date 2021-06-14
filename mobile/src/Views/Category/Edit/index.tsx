import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useTheme } from 'styled-components/native';
import { Button } from 'react-native-paper';

import { translate } from '~/Locales';

import {
    getCategory,
    updateCategory,
    deleteCategory,
} from '~/Functions/Category';

import BackButton from '~/Components/BackButton';

import { PageHeader, PageTitle } from '~/Views/Product/Add/styles';

import {
    Container,
    Content,
    PageTitleContainer,
    ActionsButtonContainer,
    ButtonPaper,
    InputTextContainer,
    InputText,
    InputTextTip,
    DialogPaper,
    Icons,
    Text,
} from './styles';

interface Props {
    id: string;
}
const Edit: React.FC = () => {
    const { params } = useRoute();
    const { reset, goBack } = useNavigation();
    const theme = useTheme();

    const [name, setName] = useState<string | undefined>(undefined);
    const [errorName, setErrorName] = useState<string>('');

    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const routeParams = params as Props;

    const handleDeleteCategory = useCallback(async () => {
        try {
            await deleteCategory({ category_id: routeParams.id });

            showMessage({
                message: translate('View_Category_Success_OnDelete'),
                type: 'info',
            });

            reset({
                routes: [
                    { name: 'Home' },
                    {
                        name: 'ListCategory',
                    },
                ],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [reset, routeParams.id]);

    useEffect(() => {
        getCategory(routeParams.id).then(response => setName(response.name));
    }, [routeParams.id]);

    const onNameChange = useCallback(value => {
        setErrorName('');
        setName(value);
    }, []);

    const handleUpdate = useCallback(async () => {
        if (!name) {
            setErrorName(translate('View_Category_Edit_ErrorEmtpyName'));
            return;
        }

        await updateCategory({
            id: routeParams.id,
            name,
        });

        showMessage({
            message: translate('View_Category_Edit_SuccessText'),
            type: 'info',
        });

        reset({
            routes: [
                { name: 'Home' },
                {
                    name: 'ListCategory',
                },
            ],
        });
    }, [routeParams.id, name, reset]);

    return (
        <>
            <Container>
                <PageHeader>
                    <PageTitleContainer>
                        <BackButton handleOnPress={goBack} />
                        <PageTitle>
                            {translate('View_Category_Edit_PageTitle')}
                        </PageTitle>
                    </PageTitleContainer>
                </PageHeader>

                <Content>
                    <InputTextContainer hasError={!!errorName}>
                        <InputText
                            placeholder={translate(
                                'View_Category_Edit_InputNamePlaceholder'
                            )}
                            value={name}
                            onChangeText={onNameChange}
                        />
                    </InputTextContainer>
                    {!!errorName && <InputTextTip>{errorName}</InputTextTip>}

                    <ActionsButtonContainer>
                        <ButtonPaper
                            icon={() => <Icons name="save-outline" size={22} />}
                            onPress={handleUpdate}
                        >
                            {translate('View_Category_Edit_ButtonSave')}
                        </ButtonPaper>

                        <ButtonPaper
                            icon={() => (
                                <Icons name="trash-outline" size={22} />
                            )}
                            onPress={() => {
                                setDeleteComponentVisible(true);
                            }}
                        >
                            {translate(
                                'View_ProductDetails_Button_DeleteProduct'
                            )}
                        </ButtonPaper>
                    </ActionsButtonContainer>
                </Content>
            </Container>
            <DialogPaper
                visible={deleteComponentVisible}
                onDismiss={() => {
                    setDeleteComponentVisible(false);
                }}
            >
                <DialogPaper.Title style={{ color: theme.colors.text }}>
                    {translate('View_Category_Edit_DeleteModal_Title')}
                </DialogPaper.Title>
                <DialogPaper.Content>
                    <Text>
                        {translate('View_Category_Edit_DeleteModal_Message')}
                    </Text>
                </DialogPaper.Content>
                <DialogPaper.Actions>
                    <Button color="red" onPress={handleDeleteCategory}>
                        {translate('View_Category_Edit_DeleteModal_Confirm')}
                    </Button>
                    <Button
                        color={theme.colors.accent}
                        onPress={() => {
                            setDeleteComponentVisible(false);
                        }}
                    >
                        {translate('View_Category_Edit_DeleteModal_Cancel')}
                    </Button>
                </DialogPaper.Actions>
            </DialogPaper>
        </>
    );
};

export default Edit;
