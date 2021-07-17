import React, { useState, useCallback, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import strings from '~/Locales';

import { getStore, updateStore, deleteStore } from '~/Functions/Stores';

import Header from '~/Components/Header';
import InputText from '~/Components/InputText';

import {
    Container,
    Content,
    ActionsButtonContainer,
    ButtonPaper,
    Icons,
} from './styles';

interface Props {
    store_id: string;
}

const Edit: React.FC = () => {
    const [storeName, setStoreName] = useState<string>('');
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const { pop, popToTop } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const route = useRoute();
    const params = route.params as Props;

    const loadData = useCallback(async () => {
        try {
            const store = await getStore(params.store_id);

            if (store) {
                setStoreName(store.name);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [params.store_id]);

    const handleUpdate = useCallback(async () => {
        try {
            await updateStore({
                id: params.store_id,
                name: storeName,
            });

            showMessage({
                message: strings.View_Store_Edit_Alert_Success_UpdateStore,
                type: 'info',
            });

            pop();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [params.store_id, pop, storeName]);

    const handleDelete = useCallback(async () => {
        try {
            await deleteStore(params.store_id);

            showMessage({
                message: strings.View_Store_Edit_Alert_Success_StoreDeleted,
                type: 'info',
            });

            popToTop();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [params.store_id, popToTop]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleTextChange = useCallback((value: string) => {
        setStoreName(value);
    }, []);

    const handleSwitchShowDelete = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    return (
        <Container>
            <Header
                title={strings.View_Store_Edit_PageTitle.replace(
                    '{STORE}',
                    storeName
                )}
                noDrawer
            />

            <Content>
                <InputText
                    placeholder={strings.View_Store_Edit_Placeholder_StoreName}
                    value={storeName}
                    onChange={handleTextChange}
                />

                <ActionsButtonContainer>
                    <ButtonPaper
                        icon={() => <Icons name="save-outline" size={22} />}
                        onPress={handleUpdate}
                    >
                        {strings.View_EditProduct_Button_Save}
                    </ButtonPaper>
                    <ButtonPaper
                        icon={() => <Icons name="trash-outline" size={22} />}
                        onPress={handleSwitchShowDelete}
                    >
                        {strings.View_ProductDetails_Button_DeleteProduct}
                    </ButtonPaper>
                </ActionsButtonContainer>
            </Content>

            <Dialog.Container
                visible={deleteComponentVisible}
                onBackdropPress={handleSwitchShowDelete}
            >
                <Dialog.Title>
                    {strings.View_Store_Edit_Delete_title}
                </Dialog.Title>
                <Dialog.Description>
                    {strings.View_Store_Edit_Delete_Description}
                </Dialog.Description>
                <Dialog.Button
                    label={strings.View_Store_Edit_Delete_Button_Cancel}
                    onPress={handleSwitchShowDelete}
                />
                <Dialog.Button
                    label={strings.View_Store_Edit_Delete_Button_Confirm}
                    color="red"
                    onPress={handleDelete}
                />
            </Dialog.Container>
        </Container>
    );
};

export default Edit;
