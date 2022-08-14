import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useRef,
} from 'react';
import { Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { getLocales } from 'react-native-localize';

import strings from '~/Locales';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { getAllowedToReadIDFA } from '~/Functions/Privacy';
import { searchForAProductInAList, getAllProducts } from '~/Functions/Products';

import Loading from '~/Components/Loading';
import Header from '~/Components/Header';
import ListProducts from '~/Components/ListProducts';
import BarCodeReader from '~/Components/BarCodeReader';
import NotificationsDenny from '~/Components/NotificationsDenny';
import OutdateApp from '~/Components/OutdateApp';

import { FloatButton, Icons } from '~/Components/ListProducts/styles';

import {
    Container,
    InputSearch,
    InputTextContainer,
    InputTextIcon,
    InputTextIconContainer,
    ActionButtonsContainer,
} from './styles';
import Banner from '~/Components/Ads/Banner';

const Home: React.FC = () => {
    const { reset, canGoBack, navigate } =
        useNavigation<StackNavigationProp<RoutesParams>>();

    const { userPreferences } = useContext(PreferencesContext);

    const listRef = useRef<FlatList<IProduct>>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [products, setProducts] = useState<Array<IProduct>>([]);

    const [searchString, setSearchString] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [enableBarCodeReader, setEnableBarCodeReader] =
        useState<boolean>(false);
    const [enableDatePicker, setEnableDatePicker] = useState(false);

    const filteredProducts =
        searchString.length > 0
            ? searchForAProductInAList({
                  products,
                  searchFor: searchString.trim(),
                  sortByExpDate: true,
              })
            : products;

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

    const handleSearchChange = useCallback(async (search: string) => {
        setSearchString(search);
    }, []);

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

    const handleSelectDateChange = useCallback((date: Date) => {
        setEnableDatePicker(false);

        let dateFormat = 'dd/MM/yyyy';
        if (getLocales()[0].languageCode === 'en') {
            dateFormat = 'MM/dd/yyyy';
        }
        const d = format(date, dateFormat);
        setSearchString(d);
        setSelectedDate(date);
    }, []);

    const handleOnCodeRead = useCallback(code => {
        setSearchString(code);
        setEnableBarCodeReader(false);
    }, []);

    useEffect(() => {
        if (
            userPreferences.isPRO &&
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
        userPreferences.isPRO,
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

                    <Banner />

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

                                {userPreferences.isPRO && (
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
                        products={filteredProducts}
                        isHome
                        onRefresh={loadData}
                        isRefreshing={isLoading}
                        listRef={listRef}
                    />

                    {!userPreferences.isPRO && (
                        <FloatButton
                            icon={() => (
                                <Icons
                                    name="add-outline"
                                    color="white"
                                    size={22}
                                />
                            )}
                            small
                            label={strings.View_FloatMenu_AddProduct}
                            onPress={handleNavigateAddProduct}
                        />
                    )}
                </Container>
            )}
        </>
    );
};

export default Home;
