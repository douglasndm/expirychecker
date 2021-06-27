import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { exists } from 'react-native-fs';
import { showMessage } from 'react-native-flash-message';
import { getLocales } from 'react-native-localize';
import { format } from 'date-fns';
import EnvConfig from 'react-native-config';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

import Ionicons from 'react-native-vector-icons/Ionicons';

import strings from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import Loading from '~/Components/Loading';
import BackButton from '~/Components/BackButton';
import { getProductById } from '~/Functions/Product';
import { sortLoteByExpDate } from '~/Functions/Lotes';
import { getStore } from '~/Functions/Stores';
import { ShareProductImageWithText } from '~/Functions/Share';
import { getProductImagePath } from '~/Functions/Products/Image';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { ProBanner, ProText } from '~/Components/ListProducts/styles';

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

    const { navigate, goBack } = useNavigation();

    const productId = useMemo(() => {
        return route.params.id;
    }, [route.params.id]);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const dateFormat = useMemo(() => {
        if (getLocales()[0].languageCode === 'en') {
            return 'MM/dd/yyyy';
        }
        return 'dd/MM/yyyy';
    }, []);

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

    const [lotes, setLotes] = useState<Array<ILote>>([]);
    const [lotesTratados, setLotesTratados] = useState<Array<ILote>>([]);
    const [lotesNaoTratados, setLotesNaoTratados] = useState<Array<ILote>>([]);

    const choosenAdText = useMemo(() => {
        const result = Math.floor(Math.random() * 3) + 1;

        switch (result) {
            case 1:
                return strings.ProBanner_Text1;

            case 2:
                return strings.ProBanner_Text2;

            case 3:
                return strings.ProBanner_Text3;

            default:
                return strings.ProBanner_Text4;
        }
    }, []);

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

            const lotesSorted = sortLoteByExpDate(result.lotes);

            setLotes(lotesSorted);
        } catch (err) {
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
        navigate('AddLote', { productId });
    }, [navigate, productId]);

    const handleEdit = useCallback(() => {
        navigate('EditProduct', { productId });
    }, [navigate, productId]);

    useEffect(() => {
        getProduct();
    }, [getProduct]);

    useEffect(() => {
        setLotesTratados(() => lotes.filter(lote => lote.status === 'Tratado'));

        setLotesNaoTratados(() =>
            lotes.filter(lote => lote.status !== 'Tratado')
        );
    }, [lotes]);

    const handleOnPhotoPress = useCallback(() => {
        if (product && product.photo) {
            navigate('PhotoView', {
                productId,
            });
        }
    }, [navigate, product, productId]);

    const handleNavigateToPro = useCallback(() => {
        navigate('Pro');
    }, [navigate]);

    const handleShare = useCallback(async () => {
        if (product) {
            if (lotesNaoTratados.length > 0) {
                const expireDate = lotesNaoTratados[0].exp_date;
                const { amount } = lotesNaoTratados[0];

                let text = '';

                if (!!amount && amount > 0) {
                    text = strings.View_ShareProduct_MessageWithAmount.replace(
                        '{PRODUCT}',
                        product.name
                    )
                        .replace('{AMOUNT}', String(amount))
                        .replace('{DATE}', format(expireDate, dateFormat));
                } else {
                    text = strings.View_ShareProduct_Message.replace(
                        '{PRODUCT}',
                        product.name
                    ).replace('{DATE}', format(expireDate, dateFormat));
                }

                await ShareProductImageWithText({
                    productId,
                    title: strings.View_ShareProduct_Title,
                    text,
                });
            }
        }
    }, [productId, product, lotesNaoTratados, dateFormat]);

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
                            {userPreferences.isUserPremium && !!photo && (
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

                                    {userPreferences.isUserPremium &&
                                        lotesNaoTratados.length > 0 && (
                                            <ActionButton
                                                icon={() => (
                                                    <Icons
                                                        name="share-social-outline"
                                                        size={22}
                                                    />
                                                )}
                                                onPress={handleShare}
                                            >
                                                {
                                                    strings.View_ProductDetails_Button_ShareProduct
                                                }
                                            </ActionButton>
                                        )}
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
                                    productId={productId}
                                />
                            </TableContainer>
                        )}

                        {!userPreferences.isUserPremium && (
                            <AdContainer>
                                <BannerAd
                                    unitId={adUnit}
                                    size={BannerAdSize.MEDIUM_RECTANGLE}
                                />

                                <ProBanner onPress={handleNavigateToPro}>
                                    <ProText>{choosenAdText}</ProText>
                                </ProBanner>
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
                                    productId={productId}
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
