import appsFlyer from 'react-native-appsflyer';
import EnvConfig from 'react-native-config';

appsFlyer.initSdk(
    {
        devKey: EnvConfig.APPSFLYER_DEV_KEY,
        isDebug: __DEV__,
        appId: EnvConfig.IOS_APPID,
        onInstallConversionDataListener: true, // Optional
        onDeepLinkListener: true, // Optional
        timeToWaitForATTUserAuthorization: 10, // for iOS 14.5
    },
    result => {
        console.log(result);
    },
    error => {
        console.error(error);
    }
);
