import React, { useCallback } from 'react';
import { Linking, Platform } from 'react-native';

import strings from '~/Locales';

import { TeamsContainer, TeamsText } from './styles';

const Banners: React.FC = () => {
    const handleNavigateToTeams = useCallback(async () => {
        await Linking.openURL(
            'https://douglasndm.dev/direct/d130b6f1-85a6-446c-a842-8583ee0219bd'
        );
    }, []);
    return (
        <TeamsContainer onPress={handleNavigateToTeams}>
            <TeamsText>
                {Platform.OS === 'ios'
                    ? strings.Banners_Teams_Button_GoToApp_IOS
                    : strings.Banners_Teams_Button_GoToApp}
            </TeamsText>
        </TeamsContainer>
    );
};

export default Banners;
