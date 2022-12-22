import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { sortCategories } from '~/Utils/Categories/Sort';
import { getAllCategories, createCategory } from '~/Functions/Category';

import Loading from '~/Components/Loading';
import Header from '@components/Header';
import PaddingComponent from '~/Components/PaddingComponent';

import {
    Container,
    InputContainer,
    InputTextContainer,
    InputText,
    List,
    ListTitle,
    Icons,
    LoadingIcon,
    InputTextTip,
    ListItemContainer,
    ListItemTitle,
    AddButtonContainer,
    AddNewItemContent,
} from '~/Styles/Views/GenericListPage';

const ListView: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newCategoryName, setNewCategoryName] = useState<
        string | undefined
    >();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const [categories, setCategories] = useState<Array<ICategory>>([]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const cats = await getAllCategories();

            const sorted = sortCategories(cats);

            setCategories(sorted);
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOnTextChange = useCallback(value => {
        setInputHasError(false);
        setInputErrorMessage('');
        setNewCategoryName(value);
    }, []);

    const handleSaveCategory = useCallback(async () => {
        try {
            if (!newCategoryName) {
                setInputHasError(true);
                setInputErrorMessage('Digite o nome da categoria');
                return;
            }

            setIsAdding(true);

            const newCategory = await createCategory(newCategoryName);

            const sorted = sortCategories([...categories, newCategory]);

            setCategories(sorted);
            setNewCategoryName('');
        } catch (err) {
            if (err instanceof Error) setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [newCategoryName, categories]);

    const handleNavigateToCategory = useCallback(
        (categoryId: string) => {
            navigate('CategoryView', {
                id: categoryId,
            });
        },
        [navigate]
    );

    const renderCategory = useCallback(
        ({ item }) => {
            return (
                <ListItemContainer
                    onPress={() => handleNavigateToCategory(item.id)}
                >
                    <ListItemTitle>{item.name}</ListItemTitle>
                </ListItemContainer>
            );
        },
        [handleNavigateToCategory]
    );
    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <Header title={strings.View_Category_List_PageTitle} />

            <AddNewItemContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newCategoryName}
                            onChangeText={handleOnTextChange}
                            placeholder={
                                strings.View_Category_List_InputAdd_Placeholder
                            }
                        />
                    </InputTextContainer>

                    <AddButtonContainer
                        onPress={handleSaveCategory}
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

            <ListTitle>
                {strings.View_Category_List_AllCategories_Label}
            </ListTitle>

            <List
                data={categories}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderCategory}
                ListFooterComponent={PaddingComponent}
            />
        </Container>
    );
};

export default ListView;
