import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import EnvConfig from 'react-native-config';
import { showMessage } from 'react-native-flash-message';
import {
	InterstitialAd,
	AdEventType,
	TestIds,
} from 'react-native-google-mobile-ads';

import { captureException } from '@services/ExceptionsHandler';

import strings from '@expirychecker/Locales';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { createLote } from '@expirychecker/Functions/Lotes';
import { getProductById } from '@expirychecker/Functions/Product';

import Loading from '@components/Loading';
import Header from '@components/Header';

import ProductBatch from '@views/Product/Add/Components/Inputs/ProductBatch';
import ProductCount from '@views/Product/Add/Components/Inputs/ProductCount';
import BatchPrice from '@views/Product/Add/Components/Inputs/BatchPrice';
import BatchExpDate from '@views/Product/Add/Components/Inputs/BatchExpDate';

import {
	Container,
	PageContent,
	InputContainer,
	InputGroup,
} from '@views/Product/Add/styles';
import { ProductHeader, ProductName, ProductCode } from './styles';

interface Props {
	route: {
		params: {
			productId: number;
		};
	};
}

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
	adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_BATCH;
} else if (Platform.OS === 'android' && !__DEV__) {
	adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDLOTE;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

const AddBatch: React.FC<Props> = ({ route }: Props) => {
	const { productId } = route.params;
	const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const { userPreferences } = useContext(PreferencesContext);

	const [adReady, setAdReady] = useState(false);

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [lote, setLote] = useState('');
	const [amount, setAmount] = useState<number | null>(null);
	const [price, setPrice] = useState<number | null>(null);

	const [expDate, setExpDate] = useState(new Date());

	const handleSave = useCallback(async () => {
		try {
			await createLote({
				productId,
				lote: {
					name: lote,
					amount: Number(amount),
					exp_date: expDate,
					price: price || undefined,
					status: 'Não tratado',
				},
				ignoreDuplicate: true,
			});

			if (!userPreferences.disableAds && adReady) {
				await interstitialAd.show();
			}

			if (userPreferences.isPRO) {
				navigate('ProductDetails', {
					id: productId,
				});

				showMessage({
					message: strings.View_Success_BatchCreated,
					type: 'info',
				});
			} else {
				navigate('Success', {
					type: 'create_batch',
					productId,
				});
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});
			}
		}
	}, [
		lote,
		productId,
		amount,
		expDate,
		price,
		userPreferences.disableAds,
		userPreferences.isPRO,
		adReady,
		navigate,
	]);

	useEffect(() => {
		interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
			setAdReady(true);
		});

		interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
			setAdReady(false);
		});

		interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
			setAdReady(false);
		});

		// Start loading the interstitial straight away
		interstitialAd.load();

		// Unsubscribe from events on unmount
		return () => {
			interstitialAd.removeAllListeners();
		};
	}, []);

	const loadData = useCallback(async () => {
		try {
			setIsLoading(true);

			const prod = await getProductById(productId);

			if (prod) {
				setName(prod.name);

				if (prod.code) setCode(prod.code);
			}
		} catch (err) {
			if (err instanceof Error) {
				showMessage({
					message: err.message,
					type: 'danger',
				});

				captureException(err);
			}
		} finally {
			setIsLoading(false);
		}
	}, [productId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return isLoading ? (
		<Loading />
	) : (
		<Container>
			<Header
				title={strings.View_AddBatch_PageTitle}
				noDrawer
				appBarActions={[
					{
						icon: 'content-save-outline',
						onPress: handleSave,
					},
				]}
			/>
			<ScrollView>
				<PageContent>
					<InputContainer>
						<ProductHeader>
							<ProductName>{name}</ProductName>
							<ProductCode>{code}</ProductCode>
						</ProductHeader>

						<InputGroup>
							<ProductBatch batch={lote} setBatch={setLote} />

							<ProductCount
								amount={amount}
								setAmount={setAmount}
							/>
						</InputGroup>

						<BatchPrice price={price} setPrice={setPrice} />

						<BatchExpDate
							expDate={expDate}
							setExpDate={setExpDate}
						/>
					</InputContainer>
				</PageContent>
			</ScrollView>
		</Container>
	);
};

export default AddBatch;
