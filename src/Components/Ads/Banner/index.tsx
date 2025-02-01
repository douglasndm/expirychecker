import React, { useContext, useMemo } from 'react';
import { Platform, PixelRatio } from 'react-native';
import EnvConfig from 'react-native-config';
import {
	BannerAd,
	BannerAdSize,
	TestIds,
} from 'react-native-google-mobile-ads';

import PreferencesContext from '@expirychecker/Contexts/PreferencesContext';

import { AdContainer } from './styles';

interface Props {
	adFor: 'Home' | 'BatchView' | 'ProductView' | 'Success';
	size?: BannerAdSize;
}

const Banner: React.FC<Props> = ({
	adFor = 'Home',
	size = BannerAdSize.BANNER,
}: Props) => {
	const { userPreferences } = useContext(PreferencesContext);

	const adUnit = useMemo(() => {
		if (adFor === 'BatchView') {
			if (Platform.OS === 'ios') {
				return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_PRODDETAILS;
			}
			if (Platform.OS === 'android') {
				return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_PRODDETAILS;
			}
		}

		if (adFor === 'ProductView') {
			if (Platform.OS === 'ios') {
				return EnvConfig.IOS_ADMOB_BANNER_VIEW_BATCH;
			}
			if (Platform.OS === 'android') {
				return EnvConfig.ANDROID_ADMOB_BANNER_VIEW_BATCH;
			}
		}

		if (adFor === 'Success') {
			if (Platform.OS === 'ios') {
				return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_SUCCESSPAGE;
			}
			if (Platform.OS === 'android') {
				return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_SUCCESSPAGE;
			}
		}

		if (Platform.OS === 'ios') {
			return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_HOME;
		}
		if (Platform.OS === 'android') {
			return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_HOME;
		}

		return TestIds.BANNER;
	}, [adFor]);

	const bannerSize = useMemo(() => {
		if (PixelRatio.get() < 2) {
			return BannerAdSize.BANNER;
		}

		if (size) {
			return size;
		}

		return BannerAdSize.LARGE_BANNER;
	}, [size]);

	return (
		<>
			{!userPreferences.disableAds && (
				<AdContainer>
					<BannerAd
						unitId={adUnit || TestIds.BANNER}
						size={bannerSize}
					/>
				</AdContainer>
			)}
		</>
	);
};

export default Banner;
