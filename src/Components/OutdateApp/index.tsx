import React, { useState, useEffect, useCallback } from 'react';
import { Linking, View } from 'react-native';
import { getBuildNumber } from 'react-native-device-info';
import Analytics from '@react-native-firebase/analytics';

import strings from '~/Locales';

import {
    isTimeToCheckUpdates,
    isAppOutdated,
    lastServerVersion,
} from '~/Functions/OutdateChecker';

import { Container, Text } from './styles';

const OutdateApp: React.FC = () => {
    const [isOutdated, setIsOutdated] = useState<boolean>(false);

    const checkUpdate = useCallback(async () => {
        const shouldCheck = await isTimeToCheckUpdates();

        if (shouldCheck) {
            const isOutdate = await isAppOutdated();

            if (isOutdate) {
                setIsOutdated(isOutdate);
            }
        }

        const lastVersion = await lastServerVersion();

        if (lastVersion > 0) {
            if (lastVersion > Number(getBuildNumber())) {
                setIsOutdated(true);
            }
        }
    }, []);

    useEffect(() => {
        checkUpdate();
    }, []);

    const handleOnPress = useCallback(async () => {
        Analytics().logEvent('User_click_in_updateApp_component');
        await Linking.openURL(
            'https://douglasndm.dev/direct/d86c7b0c-9fb3-44f4-9f87-527beb7fafd5'
        );
    }, []);

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
