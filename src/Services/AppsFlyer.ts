import appsFlyer from 'react-native-appsflyer';
import dotenv from 'react-native-config';

appsFlyer.initSdk({
    devKey: dotenv.APPSFLYER_KEY,
    isDebug: __DEV__,
});
