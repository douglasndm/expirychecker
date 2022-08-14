import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { exists } from 'react-native-fs';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';
import { showMessage } from 'react-native-flash-message';
import EnvConfig from 'react-native-config';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads';

import Ionicons from 'react-native-vector-icons/Ionicons';

import strings from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';
import { getProductById } from '~/Functions/Product';
import { sortBatches } from '~/Utils/Batches/Sort';
import { getStore } from '~/Functions/Stores';
import { getProductImagePath } from '~/Functions/Products/Image';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    ScrollView,
    PageHeader,
    ProductContainer,
    PageTitleContent,
    PageTitle,
    ProductInformationContent,
    ProductName,
    ProductCode,
    ProductStore,
    ProductImageContainer,
    ProductImage,
    ActionsButtonContainer,
    ActionButton,
    PageContent,
    Icons,
    CategoryDetails,
    CategoryDetailsText,
    AdContainer,
    TableContainer,
    FloatButton,
    ProductInfo,
} from './styles';

import BatchTable from './Components/BatchesTable';

interface Request {
    route: {
        params: {
            id: number;
        };
    };
}

const ProductDetails: React.FC<Request> = ({ route }: Request) => {
    const { userPreferences } = useContext(PreferencesContext);

    const { navigate, push, goBack, addListener } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const adUnit = useMemo(() => {
        if (__DEV__) {
            return TestIds.BANNER;
        }

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_PRODDETAILS;
        }

        return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_PRODDETAILS;
    }, []);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [product, setProduct] = useState<IProduct>();
    const [storeName, setStoreName] = useState<string | null>();

    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

    const created_at = useMemo(() => {
        if (product && product.createdAt) {
            return format(product.createdAt, dateFormat, {});
        }
        return null;
    }, [dateFormat, product]);

    const getProduct = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getProductById(productId);

            if (result.photo) {
                const imagePath = await getProductImagePath(productId);

                if (imagePath) {
                    const fileExists = await exists(imagePath);
                    if (fileExists) {
                        setPhoto(`file://${imagePath}`);
                    }
                }
            }

            if (!result || result === null) {
                goBack();
                return;
            }

            setProduct(result);

            setName(result.name);
            if (result.code) setCode(result.code);

            if (result.lotes.length > 0) {
                const lotesSorted = sortBatches(result.lotes);

                setLotesTratados(() =>
                    lotesSorted.filter(lote => lote.status === 'Tratado')
                );

                setLotesNaoTratados(() =>
                    lotesSorted.filter(lote => lote.status !== 'Tratado')
                );
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [productId, goBack]);

    useEffect(() => {
        if (product?.store) {
            getStore(product.store).then(response =>
                setStoreName(response?.name)
            );
        }
    }, [product]);

    const addNewLote = useCallback(() => {
        push('AddLote', { productId });
    }, [productId, push]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { productId });
    }, [navigate, productId]);

    const handleOnPhotoPress = useCallback(() => {
        if (product && product.photo) {
            navigate('PhotoView', {
                productId,
            });
        }
    }, [navigate, product, productId]);

    useEffect(() => {
        const unsubscribe = addListener('focus', () => {
            getProduct();
        });

        return unsubscribe;
    }, [addListener, getProduct]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <PageTitleContent>
                            <BackButton handleOnPress={goBack} />
                            <PageTitle>
                                {strings.View_ProductDetails_PageTitle}
                            </PageTitle>
                        </PageTitleContent>

                        <ProductContainer>
                            {userPreferences.isPRO && !!photo && (
                                <ProductImageContainer
                                    onPress={handleOnPhotoPress}
                                >
                                    <ProductImage
                                        source={{
                                            uri: photo,
                                        }}
                                    />
                                </ProductImageContainer>
                            )}
                            <ProductInformationContent>
                                <ProductName>{name}</ProductName>
                                {!!code && (
                                    <ProductCode>
                                        {strings.View_ProductDetails_Code}:{' '}
                                        {code}
                                    </ProductCode>
                                )}
                                {userPreferences.multiplesStores &&
                                    !!storeName && (
                                        <ProductStore>
                                            {strings.View_ProductDetails_Store}:{' '}
                                            {storeName}
                                        </ProductStore>
                                    )}
                                {created_at && (
                                    <ProductInfo>{`${strings.View_ProductDetails_AddDate.replace(
                                        '{DATE}',
                                        created_at
                                    )}`}</ProductInfo>
                                )}

                                <ActionsButtonContainer>
                                    <ActionButton
                                        icon={() => (
                                            <Icons
                                                name="create-outline"
                                                size={22}
                                            />
                                        )}
                                        onPress={handleEdit}
                                    >
                                        {
                                            strings.View_ProductDetails_Button_UpdateProduct
                                        }
                                    </ActionButton>
                                </ActionsButtonContainer>
                            </ProductInformationContent>
                        </ProductContainer>
                    </PageHeader>

                    <PageContent>
                        {lotesNaoTratados.length > 0 && (
                            <TableContainer>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {
                                            strings.View_ProductDetails_TableTitle_NotTreatedBatches
                                        }
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesNaoTratados}
                                    product_id={productId}
                                />
                            </TableContainer>
                        )}

                        {!userPreferences.disableAds && (
                            <AdContainer>
                                <BannerAd
                                    unitId={adUnit}
                                    size={BannerAdSize.MEDIUM_RECTANGLE}
                                />
                            </AdContainer>
                        )}

                        {lotesTratados.length > 0 && (
                            <>
                                <CategoryDetails>
                                    <CategoryDetailsText>
                                        {
                                            strings.View_ProductDetails_TableTitle_TreatedBatches
                                        }
                                    </CategoryDetailsText>
                                </CategoryDetails>

                                <BatchTable
                                    batches={lotesTratados}
                                    product_id={productId}
                                />
                            </>
                        )}
                    </PageContent>
                </ScrollView>
            </Container>

            <FloatButton
                icon={() => (
                    <Ionicons name="add-outline" color="white" size={22} />
                )}
                small
                label={strings.View_ProductDetails_FloatButton_AddNewBatch}
                onPress={addNewLote}
            />
        </>
    );
};

export default ProductDetails;
