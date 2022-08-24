import remoteConfig from '@react-native-firebase/remote-config';
import crashlytics from '@react-native-firebase/crashlytics';

async function init() {
    try {
        await remoteConfig().setDefaults({
            enable_app_bar: false,
            enable_app_bar_blur: false,
        });

        /*
        if (__DEV__) {
            await remoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: 5000,
            });
        }
        */

        await remoteConfig().fetchAndActivate();
    } catch (err) {
        if (err instanceof Error) {
            if (!__DEV__) {
                crashlytics().recordError(err);
            }
            console.log(err.message);
        }
    }
}

init();
