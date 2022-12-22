import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '~/Locales';

import { sortStores } from '~/Utils/Stores/Sort';

import { createStore, getAllStores } from '~/Functions/Stores';

import Header from '@components/Header';
import PaddingComponent from '~/Components/PaddingComponent';

import {
    Container,
    InputContainer,
    InputTextContainer,
    InputText,
    List,
    Icons,
    LoadingIcon,
    InputTextTip,
    ListItemContainer,
    ListItemTitle,
    AddButtonContainer,
    AddNewItemContent,
} from '~/Styles/Views/GenericListPage';

const ListView: React.FC = () => {
    const { navigate, addListener } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const [newStoreName, setNewStoreName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [stores, setStores] = useState<Array<IStore>>([]);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewStoreName(value);
    }, []);

    const handleSaveStore = useCallback(async () => {
        try {
            if (!newStoreName) {
                setInputHasError(true);
                setInputErrorMessage(
                    strings.View_Store_List_AddNewStore_Error_TextEmpty
                );
                return;
            }

            setIsAdding(true);

            const newStore = await createStore(newStoreName);

            const sorted = sortStores([...stores, newStore]);

            setStores(sorted);
            setNewStoreName('');
        } catch (err) {
            if (err instanceof Error) setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newStoreName, stores]);

    const handleNavigateToStore = useCallback(
        (store: IStore | string) => {
            navigate('StoreDetails', {
                store,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            let storeToNavigate: string;

            if (item.id) {
                storeToNavigate = item.id;
            } else if (!item.id && item.name) {
                storeToNavigate = item.name;
            } else {
                storeToNavigate = item;
            }

            return (
                <ListItemContainer
                    onPress={() => handleNavigateToStore(storeToNavigate)}
                >
                    <ListItemTitle>{item.name}</ListItemTitle>
                </ListItemContainer>
            );
        },
        [handleNavigateToStore]
    );

    useEffect(() => {
        const unsubscribe = addListener('focus', () => {
            getAllStores().then(response => {
                const noStore: IStore = {
                    id: '000',
                    name: strings.View_Store_List_NoStore,
                };

                const sorted = sortStores(response);

                setStores([...sorted, noStore]);
            });
        });

        return unsubscribe;
    }, [addListener]);

    return (
        <Container>
            <Header title={strings.View_Store_List_PageTitle} />

            <AddNewItemContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newStoreName}
                            onChangeText={handleOnTextChange}
                            placeholder={
                                strings.View_Store_List_AddNewStore_Placeholder
                            }
                        />
                    </InputTextContainer>

                    <AddButtonContainer
                        onPress={handleSaveStore}
                        enabled={!isAdding}
                    >
                        {isAdding ? (
                            <LoadingIcon />
                        ) : (
                            <Icons name="add-circle-outline" />
                        )}
                    </AddButtonContainer>
                </InputContainer>

                {!!inputErrorMessage && (
                    <InputTextTip>{inputErrorMessage}</InputTextTip>
                )}
            </AddNewItemContent>

            <List
                data={stores}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
                ListFooterComponent={PaddingComponent}
            />
        </Container>
    );
};

export default ListView;
