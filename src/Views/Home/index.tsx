import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
} from 'react';
import { Platform, PixelRatio } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import EnvConfig from 'react-native-config';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getAllowedToReadIDFA } from '~/Functions/Privacy';
import { searchForAProductInAList, getAllProducts } from '~/Functions/Products';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';

import {
    Container,
    AdContainer,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
} from './styles';

const Home: React.FC = () => {
    const { reset, addListener } = useNavigation();

    const { userPreferences } = useContext(PreferencesContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>();
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);
    const [enableBarCodeReader, setEnableBarCodeReader] = useState<boolean>(
        false
    );

    useEffect(() => {
        if (Platform.OS === 'ios') {
            getAllowedToReadIDFA().then(response => {
                if (response === null) {
                    reset({
                        routes: [{ name: 'TrackingPermission' }],
                    });
                }
            });
        }
    }, [reset]);

    const adUnit = useMemo(() => {
        if (__DEV__) {
            return TestIds.BANNER;
        }

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_HOME;
        }

        return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_HOME;
    }, []);

    const bannerSize = useMemo(() => {
        if (PixelRatio.get() < 2) {
            return BannerAdSize.BANNER;
        }

        return BannerAdSize.LARGE_BANNER;
    }, []);

    const getProduts = useCallback(async () => {
        try {
            setIsLoading(true);
            const allProducts = await getAllProducts({
                limit: 20,
                removeProductsWithoutBatches: true,
                removeTreatedBatch: true,
                sortProductsByExpDate: true,
            });

            setProducts(allProducts);
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
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const allProducts = await getAllProducts({});

                const findProducts = searchForAProductInAList({
                    products: allProducts,
                    searchFor: search,
                    sortByExpDate: true,
                });

                setProductsSearch(findProducts);
            } else {
                setProductsSearch(products);
            }
        },
        [products]
    );

    useEffect(() => {
        getProduts();
    }, [getProduts]);

    // useEffect(() => {
    //     const unsubscribe = addListener('focus', () => {
    //         getProduts();
    //     });

    //     return unsubscribe;
    // }, [addListener, getProduts]);

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const handleOnCodeRead = useCallback(
        code => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    const handleReload = useCallback(async () => {
        try {
            setIsRefreshing(true);

            // await new Promise(f => setTimeout(f, 5000));

            await getProduts();
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsRefreshing(false);
        }
    }, [getProduts]);

    return isLoading ? (
        <Loading />
    ) : (
        <>
            {enableBarCodeReader ? (
                <BarCodeReader
                    onCodeRead={handleOnCodeRead}
                    onClose={handleOnBarCodeReaderClose}
                />
            ) : (
                <Container>
                    <Header />

                    {!userPreferences.isUserPremium && (
                        <AdContainer>
                            <BannerAd unitId={adUnit} size={bannerSize} />
                        </AdContainer>
                    )}

                    {products.length > 0 && (
                        <InputTextContainer>
                            <InputSearch
                                placeholder={strings.View_Home_SearchText}
                                value={searchString}
                                onChangeText={handleSearchChange}
                            />
                            <InputTextIconContainer
                                onPress={handleOnBarCodeReaderOpen}
                            >
                                <InputTextIcon name="barcode-outline" />
                            </InputTextIconContainer>
                        </InputTextContainer>
                    )}

                    <ListProducts
                        products={productsSearch}
                        isHome
                        onRefresh={handleReload}
                        isRefreshing={isRefreshing}
                    />
                </Container>
            )}
        </>
    );
};

export default Home;
