import React, { useCallback } from 'react';
import RNPermissions, { request } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '~/Locales';

import { setAllowedToReadIDFA } from '~/Functions/Privacy';

import Button from '~/Components/Button';

import { Container, Content, PageTitle, Message } from './styles';

const AppleATT: React.FC = () => {
    const { reset } = useNavigation<StackNavigationProp<RoutesParams>>();

    const handleContinue = useCallback(async () => {
        let response = null;

        response = await request(
            RNPermissions.PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY
        );

        if (response === 'granted') {
            await setAllowedToReadIDFA(true);
        } else {
            await setAllowedToReadIDFA(false);
        }

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [reset]);

    return (
        <Container>
            <Content>
                <PageTitle>
                    {strings.View_Permissions_AppleAT_PageTitle}
                </PageTitle>
                <Message>{strings.View_Permissions_AppleAT_Message}</Message>

                <Button
                    text={strings.View_Permissions_AppleAT_Button_Continue}
                    onPress={handleContinue}
                />
            </Content>
        </Container>
    );
};

export default AppleATT;
