import { Adjust, AdjustConfig } from 'react-native-adjust';
import EnvConfig from 'react-native-config';

function init(): void {
    const adjustConfig = new AdjustConfig(
        EnvConfig.ADJUST_TOKEN,
        __DEV__
            ? AdjustConfig.EnvironmentSandbox
            : AdjustConfig.EnvironmentProduction
    );

    if (__DEV__) {
        adjustConfig.setLogLevel(AdjustConfig.LogLevelVerbose);
    }
    Adjust.create(adjustConfig);
}

init();
