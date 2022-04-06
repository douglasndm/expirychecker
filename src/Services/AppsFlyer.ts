import appsFlyer from 'react-native-appsflyer';
import Config from 'react-native-config';

appsFlyer.initSdk({
    devKey: Config.APPSFLYER_KEY,
    isDebug: __DEV__,
    appId: Config.IOS_APPID,
    onInstallConversionDataListener: true,
    onDeepLinkListener: true,
    timeToWaitForATTUserAuthorization: 60,
});
