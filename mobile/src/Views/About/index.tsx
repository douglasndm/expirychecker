import React, { useState, useCallback } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import strings from '~/Locales';

import { shareText } from '~/Functions/Share';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import {
    Container,
    Content,
    PageTitle,
    ApplicationVersion,
    AboutSection,
    ApplicationName,
    Text,
    Link,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();

    const [tapsCount, setTapsCount] = useState<number>(0);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
    }, []);

    const navigateToTelegram = useCallback(async () => {
        await Linking.openURL('https://t.me/douglasdev');
    }, []);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    const handleLinkedinPress = useCallback(async () => {
        await Linking.openURL('https://www.linkedin.com/in/douglasndm/');
    }, []);

    const handleFlatIconPress = useCallback(async () => {
        await Linking.openURL('https://www.flaticon.com/authors/srip');
    }, []);

    const handleClickDev = useCallback(async () => {
        setTapsCount(tapsCount + 1);

        if (tapsCount > 10) {
            const token = await messaging().getToken();
            shareText({
                title: 'token',
                text: token,
            });
        }
    }, [tapsCount]);

    return (
        <Container>
            <StatusBar />
            <Content>
                <BackButton handleOnPress={goBack} />
                <PageTitle>{strings.View_About_PageTitle}</PageTitle>
            </Content>

            <AboutSection>
                <ApplicationName>{strings.AppName}</ApplicationName>

                <ApplicationVersion>
                    {strings.View_About_AppVersion + getVersion()}
                </ApplicationVersion>
            </AboutSection>

            <AboutSection>
                <Link onPress={handleNavigateToSite}>
                    {strings.Menu_Button_KnowOthersApps}
                </Link>
            </AboutSection>

            <AboutSection>
                <Text>
                    {strings.BeforeTermsAndPrivacy}
                    <Link onPress={navigateToTerms}>{strings.Terms}</Link>
                    {strings.BetweenTermsAndPrivacy}
                    <Link onPress={navigateToPrivacy}>
                        {strings.PrivacyPolicy}
                    </Link>
                    .
                </Text>
            </AboutSection>

            <AboutSection>
                <Text onPress={handleClickDev}>
                    {strings.View_About_DevelopedBy}
                </Text>
                <Link onPress={handleLinkedinPress}>Linkedin</Link>
            </AboutSection>

            <AboutSection>
                <Text>{strings.View_About_NeedHelp}</Text>
                <Link onPress={navigateToTelegram}>
                    {strings.View_About_HelpTelegram}
                </Link>
            </AboutSection>

            <AboutSection>
                <Text>{strings.View_About_LogoMadeBy}</Text>

                <View>
                    <Link onPress={handleFlatIconPress}>
                        https://www.flaticon.com/authors/srip
                    </Link>
                </View>
            </AboutSection>
        </Container>
    );
};

export default About;
