import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import {
    InterstitialAd,
    BannerAd,
    BannerAdSize,
    AdEventType,
    TestIds,
} from '@react-native-firebase/admob';

// import { Container } from './styles';

const Test = () => {
    const [adLoaded, setAdLoaded] = useState(false);

    const ad = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

    useEffect(() => {
        const eventListener = ad.onAdEvent((type) => {
            if (type === AdEventType.LOADED) {
                setAdLoaded(true);
            }
            if (type === AdEventType.CLOSED) {
                console.log('ad closed');
                setAdLoaded(false);

                // reload ad
                ad.load();
            }
        });

        // Start loading the interstitial straight away
        ad.load();

        // Unsubscribe from events on unmount
        return () => {
            eventListener();
        };
    }, [adLoaded]);

    return (
        <View>
            <View>
                {adLoaded ? (
                    <Button
                        onPress={() => {
                            ad.show();
                        }}
                        title="Show Interstitial"
                    />
                ) : null}
            </View>

            <View />
        </View>
    );
};

export default Test;
