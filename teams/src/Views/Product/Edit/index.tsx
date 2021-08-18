import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { exists } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';
import Dialog from 'react-native-dialog';

import { StackNavigationProp } from '@react-navigation/stack';
import strings from '~/Locales';

import { useTeam } from '~/Contexts/TeamContext';

import { deleteProduct, updateProduct } from '~/Functions/Products/Product';
import { getAllCategoriesFromTeam } from '~/Functions/Categories';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';
import Camera, { onPhotoTakedProps } from '~/Components/Camera';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    PageTitle,
    PageContent,
    InputGroup,
    InputContainer,
    InputTextContainer,
    InputText,
    InputTextTip,
    InputCodeTextContainer,
    InputCodeTextIcon,
    InputCodeText,
    InputTextIconContainer,
    ProductImage,
    CameraButtonContainer,
    CameraButtonIcon,
    ProductImageContainer,
    MoreInformationsContainer,
    MoreInformationsTitle,
    PickerContainer,
    Picker,
} from '../Add/styles';

import {
    PageHeader,
    ButtonPaper,
    Icons,
    ActionsButtonContainer,
    PageTitleContainer,
} from './styles';

interface RequestParams {
    route: {
        params: {
            product: string;
        };
    };
}

interface ICategoryItem {
    label: string;
    value: string;
    key: string;
}

const Edit: React.FC<RequestParams> = ({ route }: RequestParams) => {
    const { reset, goBack, replace } = useNavigation<
        StackNavigationProp<RoutesParams>
    >();

    const teamContext = useTeam();

    const userRole = useMemo(() => {
        if (teamContext.roleInTeam) {
            return teamContext.roleInTeam.role.toLowerCase();
        }

        return 'repositor';
    }, [teamContext.roleInTeam]);

    const product = useMemo<IProduct>(() => {
        return JSON.parse(route.params.product);
    }, [route.params.product]);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deleteComponentVisible, setDeleteComponentVisible] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState<string | undefined>('');
    const [photoPath, setPhotoPath] = useState<string>('');
    const [categories, setCategories] = useState<Array<ICategoryItem>>([]);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    const [nameFieldError, setNameFieldError] = useState<boolean>(false);

    const [isCameraEnabled, setIsCameraEnabled] = useState(false);
    const [isBarCodeEnabled, setIsBarCodeEnabled] = useState(false);

    const loadData = useCallback(async () => {
        if (!teamContext.id) {
            return;
        }
        try {
            setIsLoading(true);

            setName(product.name);
            setCode(product.code);

            const categoriesResponse = await getAllCategoriesFromTeam({
                team_id: teamContext.id,
            });

            const categoriesArray: Array<ICategoryItem> = [];

            categoriesResponse.forEach(cat =>
                categoriesArray.push({
                    key: cat.id,
                    label: cat.name,
                    value: cat.id,
                })
            );
            setCategories(categoriesArray);

            if (product.categories.length > 0) {
                setSelectedCategory(product.categories[0].id);
            }
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }
    }, [product.categories, product.code, product.name, teamContext.id]);

    const updateProd = useCallback(async () => {
        if (!name || name.trim() === '') {
            setNameFieldError(true);
            return;
        }

        try {
            const prodCategories: Array<string> = [];

            if (selectedCategory && selectedCategory !== 'null') {
                prodCategories.push(selectedCategory);
            }

            await updateProduct({
                product: {
                    id: product.id,
                    name,
                    code,
                },
                categories: prodCategories,
            });

            showMessage({
                message: strings.View_Success_ProductUpdated,
                type: 'info',
            });

            replace('ProductDetails', {
                id: product.id,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        }
    }, [code, name, product.id, replace, selectedCategory]);

    const handleDeleteProduct = useCallback(async () => {
        try {
            await deleteProduct({ product_id: product.id });

            showMessage({
                message: strings.View_Success_ProductDeleted,
                type: 'info',
            });

            reset({
                routes: [{ name: 'Home' }],
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setDeleteComponentVisible(false);
        }
    }, [product, reset]);

    const handleOnCodeRead = useCallback((codeRead: string) => {
        setCode(codeRead);
        setIsBarCodeEnabled(false);
    }, []);

    const handleEnableCamera = useCallback(() => {
        setIsBarCodeEnabled(false);
        setIsCameraEnabled(true);
    }, []);

    const handleDisableCamera = useCallback(() => {
        setIsCameraEnabled(false);
    }, []);

    const handleEnableBarCodeReader = useCallback(() => {
        setIsCameraEnabled(false);
        setIsBarCodeEnabled(true);
    }, []);

    const handleDisableBarCodeReader = useCallback(() => {
        setIsBarCodeEnabled(false);
    }, []);

    const handleCategoryChange = useCallback(value => {
        setSelectedCategory(value);
    }, []);

    const onPhotoTaked = useCallback(
        async ({ fileName, filePath }: onPhotoTakedProps) => {
            if (await exists(filePath)) {
                setPhotoPath(filePath);
            }
            handleDisableCamera();
        },
        [handleDisableCamera]
    );

    const handleSwitchShowDeleteProduct = useCallback(() => {
        setDeleteComponentVisible(!deleteComponentVisible);
    }, [deleteComponentVisible]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {isCameraEnabled ? (
                <Camera
                    onPhotoTaked={onPhotoTaked}
                    onBackButtonPressed={handleDisableCamera}
                />
            ) : (
                <>
                    {isBarCodeEnabled ? (
                        <BarCodeReader
                            onCodeRead={handleOnCodeRead}
                            onClose={handleDisableBarCodeReader}
                        />
                    ) : (
                        <Container>
                            <StatusBar />
                            <PageHeader>
                                <PageTitleContainer>
                                    <BackButton handleOnPress={goBack} />
                                    <PageTitle>
                                        {strings.View_EditProduct_PageTitle}
                                    </PageTitle>
                                </PageTitleContainer>

                                <ActionsButtonContainer>
                                    <ButtonPaper
                                        icon={() => (
                                            <Icons
                                                name="save-outline"
                                                size={22}
                                            />
                                        )}
                                        onPress={updateProd}
                                    >
                                        {strings.View_EditProduct_Button_Save}
                                    </ButtonPaper>

                                    {(userRole === 'manager' ||
                                        userRole === 'supervisor') && (
                                        <ButtonPaper
                                            icon={() => (
                                                <Icons
                                                    name="trash-outline"
                                                    size={22}
                                                />
                                            )}
                                            onPress={() => {
                                                setDeleteComponentVisible(true);
                                            }}
                                        >
                                            {
                                                strings.View_ProductDetails_Button_DeleteProduct
                                            }
                                        </ButtonPaper>
                                    )}
                                </ActionsButtonContainer>
                            </PageHeader>

                            <PageContent>
                                {/* {!!photoPath && (
                                        <ProductImageContainer
                                            onPress={handleEnableCamera}
                                        >
                                            <ProductImage
                                                source={{
                                                    uri: `file://${photoPath}`,
                                                }}
                                            />
                                        </ProductImageContainer>
                                    )} */}

                                <InputContainer>
                                    <InputGroup>
                                        <InputTextContainer>
                                            <InputText
                                                placeholder={
                                                    strings.View_EditProduct_InputPlacehoder_Name
                                                }
                                                accessibilityLabel={
                                                    strings.View_EditProduct_InputAccessibility_Name
                                                }
                                                value={name}
                                                onChangeText={value => {
                                                    setName(value);
                                                    setNameFieldError(false);
                                                }}
                                            />
                                        </InputTextContainer>

                                        {/* <CameraButtonContainer
                                                onPress={handleEnableCamera}
                                            >
                                                <CameraButtonIcon />
                                            </CameraButtonContainer> */}
                                    </InputGroup>
                                    {nameFieldError && (
                                        <InputTextTip>
                                            {
                                                strings.View_EditProduct_Error_EmptyProductName
                                            }
                                        </InputTextTip>
                                    )}

                                    <InputCodeTextContainer>
                                        <InputCodeText
                                            placeholder={
                                                strings.View_EditProduct_InputPlacehoder_Code
                                            }
                                            accessibilityLabel={
                                                strings.View_EditProduct_InputAccessibility_Code
                                            }
                                            value={code}
                                            onChangeText={value =>
                                                setCode(value)
                                            }
                                        />
                                        <InputTextIconContainer
                                            onPress={handleEnableBarCodeReader}
                                        >
                                            <InputCodeTextIcon />
                                        </InputTextIconContainer>
                                    </InputCodeTextContainer>

                                    <MoreInformationsContainer>
                                        <MoreInformationsTitle>
                                            {
                                                strings.View_AddProduct_MoreInformation_Label
                                            }
                                        </MoreInformationsTitle>

                                        <PickerContainer
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Picker
                                                items={categories}
                                                onValueChange={
                                                    handleCategoryChange
                                                }
                                                value={selectedCategory}
                                                placeholder={{
                                                    label:
                                                        strings.View_AddProduct_InputPlaceholder_SelectCategory,
                                                    value: 'null',
                                                }}
                                            />
                                        </PickerContainer>
                                    </MoreInformationsContainer>
                                </InputContainer>
                            </PageContent>

                            <Dialog.Container
                                visible={deleteComponentVisible}
                                onBackdropPress={handleSwitchShowDeleteProduct}
                            >
                                <Dialog.Title>
                                    {
                                        strings.View_ProductDetails_WarningDelete_Title
                                    }
                                </Dialog.Title>
                                <Dialog.Description>
                                    {
                                        strings.View_ProductDetails_WarningDelete_Message
                                    }
                                </Dialog.Description>
                                <Dialog.Button
                                    label={
                                        strings.View_ProductDetails_WarningDelete_Button_Cancel
                                    }
                                    onPress={handleSwitchShowDeleteProduct}
                                />
                                <Dialog.Button
                                    label={
                                        strings.View_ProductDetails_WarningDelete_Button_Confirm
                                    }
                                    color="red"
                                    onPress={handleDeleteProduct}
                                />
                            </Dialog.Container>
                        </Container>
                    )}
                </>
            )}
        </>
    );
};

export default Edit;
