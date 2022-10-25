import React, {
    useState,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react';
import { View, Platform } from 'react-native';
import EnvConfig from 'react-native-config';
import {
    InterstitialAd,
    AdEventType,
    TestIds,
} from 'react-native-google-mobile-ads';

let adUnit = TestIds.INTERSTITIAL;

if (Platform.OS === 'ios' && !__DEV__) {
    adUnit = EnvConfig.IOS_ADUNIT_INTERSTITIAL_ADD_PRODUCT;
} else if (Platform.OS === 'android' && !__DEV__) {
    adUnit = EnvConfig.ANDROID_ADMOB_ADUNITID_ADDPRODUCT;
}

const interstitialAd = InterstitialAd.createForAdRequest(adUnit);

export interface IInterstitialRef {
    showInterstitial: () => void;
}

const Interstitial = forwardRef<IInterstitialRef>((props, ref) => {
    const [adReady, setAdReady] = useState(false);

    useEffect(() => {
        const eventListener = interstitialAd.onAdEvent(type => {
            if (type === AdEventType.LOADED) {
                setAdReady(true);
            }
            if (type === AdEventType.CLOSED) {
                setAdReady(false);
            }
            if (type === AdEventType.ERROR) {
                setAdReady(false);
            }
        });

        // Start loading the interstitial straight away
        interstitialAd.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, []);

    const showInterstitial = useCallback(async () => {
        if (adReady) {
            await interstitialAd.show();
        }
    }, [adReady]);

    useImperativeHandle(ref, () => ({
        showInterstitial,
    }));

    return <View />;
});

export default Interstitial;
