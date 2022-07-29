import React, { useState, useEffect, useCallback } from 'react';
import { Linking, View } from 'react-native';
import Analytics from '@react-native-firebase/analytics';
import { checkVersion, CheckVersionResponse } from 'react-native-check-version';

import strings from '~/Locales';

import { Container, Text } from './styles';

const OutdateApp: React.FC = () => {
    const [isOutdated, setIsOutdated] = useState<boolean>(false);

    const [appVersion, setAppVersion] = useState<
        CheckVersionResponse | undefined
    >();

    const checkUpdate = useCallback(async () => {
        try {
            const version = await checkVersion();
            setAppVersion(version);

            if (version) {
                if (version.needsUpdate) {
                    setIsOutdated(true);
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                console.log(
                    `Fail on search for app updates on own server: ${err.message}`
                );
            }
        }
    }, []);

    useEffect(() => {
        checkUpdate();
    }, []);

    const handleOnPress = useCallback(async () => {
        Analytics().logEvent('User_click_in_updateApp_component');

        if (appVersion && appVersion.needsUpdate) {
            await Linking.openURL(appVersion.url);
        }
    }, [appVersion]);

    return (
        <View>
            {isOutdated && (
                <Container onPress={handleOnPress}>
                    <Text>{strings.OutdatedApp_Message}</Text>
                </Container>
            )}
        </View>
    );
};

export default OutdateApp;
