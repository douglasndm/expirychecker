import React, { useContext, useMemo } from 'react';
import { Platform, View, PixelRatio } from 'react-native';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads';
import EnvConfig from 'react-native-config';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { AdContainer } from './styles';

const Banner: React.FC = () => {
    const { userPreferences } = useContext(PreferencesContext);

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

    return (
        <View>
            {!userPreferences.disableAds && (
                <AdContainer>
                    <BannerAd unitId={adUnit} size={bannerSize} />
                </AdContainer>
            )}
        </View>
    );
};

export default Banner;
