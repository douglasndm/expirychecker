import remoteConfig from '@react-native-firebase/remote-config';

import Sentry from './Sentry';

async function init() {
    try {
        await remoteConfig().setDefaults({
            enable_app_bar: true,
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
                Sentry.captureException(err);
            }
            console.log(err.message);
        }
    }
}

init();
