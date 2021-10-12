import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import { createBrand, getAllBrands } from '~/Utils/Brands';

import Header from '~/Components/Header';
import Loading from '~/Components/Loading';

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
    const { navigate } = useNavigation();

    const [brands, setBrands] = useState<Array<IBrand>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [newBrandName, setNewBrandName] = useState<string | undefined>();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [inputHasError, setInputHasError] = useState<boolean>(false);
    const [inputErrorMessage, setInputErrorMessage] = useState<string>('');

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await getAllBrands();

            setBrands(response);
        } catch (err) {
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
        setNewBrandName(value);
    }, []);

    const handleSaveBrand = useCallback(async () => {
        try {
            if (!newBrandName) {
                setInputHasError(true);
                setInputErrorMessage(
                    strings.View_Brand_List_InputAdd_Error_EmptyTextField
                );
                return;
            }

            setIsAdding(true);

            const newBrand = await createBrand(newBrandName);

            setBrands([...brands, newBrand]);
            setNewBrandName('');
        } catch (err) {
            setInputErrorMessage(err.message);
        } finally {
            setIsAdding(false);
        }
    }, [brands, newBrandName]);

    const handleNavigateToCategory = useCallback(
        (categoryId: string) => {
            navigate('CategoryView', {
                id: categoryId,
            });
        },
        [navigate]
    );

    const renderItem = useCallback(
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
            <Header title={strings.View_Brand_List_PageTitle} />

            <AddNewItemContent>
                <InputContainer>
                    <InputTextContainer hasError={inputHasError}>
                        <InputText
                            value={newBrandName}
                            onChangeText={handleOnTextChange}
                            placeholder={
                                strings.View_Brand_List_InputAdd_Placeholder
                            }
                        />
                    </InputTextContainer>

                    <AddButtonContainer
                        onPress={handleSaveBrand}
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

            <ListTitle>{strings.View_Brand_List_AllCategories_Label}</ListTitle>

            <List
                data={brands}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
            />
        </Container>
    );
};

export default ListView;
