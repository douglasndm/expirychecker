import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
    useRef,
} from 'react';
import { Platform, PixelRatio, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads';
import EnvConfig from 'react-native-config';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import Header from '@shared/Components/Header';
import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getAllowedToReadIDFA } from '~/Functions/Privacy';
import { searchForAProductInAList, getAllProducts } from '~/Functions/Products';

import Loading from '~/Components/Loading';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';
import NotificationsDenny from '~/Components/NotificationsDenny';
import OutdateApp from '~/Components/OutdateApp';

import { FloatButton, Icons } from '~/Components/ListProducts/styles';

import {
    Container,
    AdContainer,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
    ActionButtonsContainer,
} from './styles';

const Home: React.FC = () => {
    const { reset, canGoBack, navigate } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const { userPreferences } = useContext(PreferencesContext);

    const listRef = useRef<FlatList<IProduct>>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);
    const [productsSearch, setProductsSearch] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [enableBarCodeReader, setEnableBarCodeReader] =
        useState<boolean>(false);
    const [enableDatePicker, setEnableDatePicker] = useState(false);

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

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const allProducts = await getAllProducts({
                removeProductsWithoutBatches: true,
                removeTreatedBatch: true,
                sortProductsByExpDate: true,
            });
            setProducts(allProducts);
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
        setProductsSearch(products);
    }, [products]);

    const handleSearchChange = useCallback(
        async (search: string) => {
            setSearchString(search);

            if (search && search !== '') {
                const findProducts = searchForAProductInAList({
                    products,
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
        loadData();
    }, [loadData]);

    const handleOnBarCodeReaderOpen = useCallback(() => {
        setEnableBarCodeReader(true);
    }, []);

    const handleOnBarCodeReaderClose = useCallback(() => {
        setEnableBarCodeReader(false);
    }, []);

    const enableCalendarModal = useCallback(() => {
        setEnableDatePicker(true);
    }, []);

    const handleSelectDateChange = useCallback(
        (date: Date) => {
            setEnableDatePicker(false);

            let dateFormat = 'dd/MM/yyyy';
            if (getLocales()[0].languageCode === 'en') {
                dateFormat = 'MM/dd/yyyy';
            }
            const d = format(date, dateFormat);
            setSearchString(d);
            setSelectedDate(date);
            handleSearchChange(d);
        },
        [handleSearchChange]
    );

    const handleOnCodeRead = useCallback(
        code => {
            setSearchString(code);
            handleSearchChange(code);
            setEnableBarCodeReader(false);
        },
        [handleSearchChange]
    );

    useEffect(() => {
        if (
            userPreferences.isUserPremium &&
            userPreferences.multiplesStores &&
            userPreferences.storesFirstPage
        ) {
            if (!canGoBack()) {
                reset({
                    routes: [{ name: 'StoreList' }],
                });
            }
        }
    }, [
        canGoBack,
        reset,
        userPreferences.isUserPremium,
        userPreferences.multiplesStores,
        userPreferences.storesFirstPage,
    ]);

    const handleNavigateAddProduct = useCallback(() => {
        if (searchString && searchString !== '') {
            const queryWithoutLetters = searchString.replace(/\D/g, '').trim();
            const query = queryWithoutLetters.replace(/^0+/, ''); // Remove zero on begin

            navigate('AddProduct', {
                code: query,
            });
        } else {
            navigate('AddProduct', {});
        }
    }, [navigate, searchString]);

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
                    <Header listRef={listRef} />

                    <NotificationsDenny />

                    <OutdateApp />

                    {!userPreferences.disableAds && (
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

                            <ActionButtonsContainer>
                                <InputTextIconContainer
                                    onPress={handleOnBarCodeReaderOpen}
                                >
                                    <InputTextIcon name="barcode-outline" />
                                </InputTextIconContainer>

                                {userPreferences.isUserPremium && (
                                    <InputTextIconContainer
                                        onPress={enableCalendarModal}
                                        style={{ marginLeft: 5 }}
                                    >
                                        <InputTextIcon name="calendar-outline" />
                                    </InputTextIconContainer>
                                )}
                            </ActionButtonsContainer>
                        </InputTextContainer>
                    )}

                    <DatePicker
                        modal
                        mode="date"
                        open={enableDatePicker}
                        date={selectedDate}
                        onConfirm={handleSelectDateChange}
                        onCancel={() => {
                            setEnableDatePicker(false);
                        }}
                    />

                    <ListProducts
                        products={productsSearch}
                        isHome
                        onRefresh={loadData}
                        isRefreshing={isLoading}
                        listRef={listRef}
                        deactiveFloatButton
                    />

                    <FloatButton
                        icon={() => (
                            <Icons name="add-outline" color="white" size={22} />
                        )}
                        small
                        label={strings.View_FloatMenu_AddProduct}
                        onPress={handleNavigateAddProduct}
                    />
                </Container>
            )}
        </>
    );
};

export default Home;
