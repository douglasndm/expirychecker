import appsFlyer from 'react-native-appsflyer';
import dotenv from 'react-native-config';
import Purchases from 'react-native-purchases';

appsFlyer.initSdk({
    devKey: dotenv.APPSFLYER_KEY,
    isDebug: __DEV__,
    appId: dotenv.IOS_APP_ID,
    timeToWaitForATTUserAuthorization: 15,
});

appsFlyer.getAppsFlyerUID((error, id) => {
    if (!error) {
        Purchases.setAppsflyerID(id);
    }
});
