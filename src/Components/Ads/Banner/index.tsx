import React, { useContext, useMemo } from 'react';
import { Platform, View, PixelRatio } from 'react-native';
import EnvConfig from 'react-native-config';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads';

import PreferencesContext from '~/Contexts/PreferencesContext';

import { AdContainer } from './styles';

interface Props {
    AdFor: 'Home' | 'BatchView';
    Size?: BannerAdSize;
}

const Banner: React.FC<Props> = ({
    AdFor = 'Home',
    Size = BannerAdSize.BANNER,
}: Props) => {
    const { userPreferences } = useContext(PreferencesContext);

    const adUnit = useMemo(() => {
        if (AdFor === 'BatchView') {
            if (Platform.OS === 'ios') {
                return EnvConfig.IOS_ADMOB_BANNER_VIEW_BATCH;
            }
            if (Platform.OS === 'android') {
                return EnvConfig.ANDROID_ADMOB_BANNER_VIEW_BATCH;
            }
        }

        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_BANNER_HOME;
        }
        if (Platform.OS === 'android') {
            return EnvConfig.ANDROID_ADMOB_ADUNITID_BANNER_HOME;
        }

        return TestIds.BANNER;
    }, [AdFor]);

    const bannerSize = useMemo(() => {
        if (PixelRatio.get() < 2) {
            return BannerAdSize.BANNER;
        }

        if (Size) {
            return Size;
        }

        return BannerAdSize.LARGE_BANNER;
    }, [Size]);

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
