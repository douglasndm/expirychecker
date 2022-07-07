import React, { useState, useCallback, useEffect } from 'react';
import { View, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    getVersion,
    getBuildNumber,
    getSystemName,
    getSystemVersion,
} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import Purchases from 'react-native-purchases';
import OneSignal from 'react-native-onesignal';

import strings from '~/Locales';

import { shareText } from '~/Functions/Share';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import {
    Container,
    Content,
    PageTitle,
    ApplicationName,
    ApplicationVersion,
    AboutSection,
    UserId,
    Text,
    Link,
    SocialContainer,
    SocialIcon,
    IdContainer,
} from './styles';

const About: React.FC = () => {
    const { goBack } = useNavigation();

    const [pid, setPid] = useState('');
    const [signalId, setSignalId] = useState('');
    const [firebaseId, setFirebaseId] = useState('');

    const loadData = useCallback(async () => {
        const purchase = await Purchases.getAppUserID();
        const oneSignal = await OneSignal.getDeviceState();
        const firebase = await messaging().getToken();

        setPid(purchase);
        setSignalId(oneSignal.userId);
        setFirebaseId(firebase);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const handleNavigateToSite = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev');
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

    const handleNaviTwitter = useCallback(async () => {
        await Linking.openURL('https://www.twitter.com/douglasndmdev/');
    }, []);

    const handleNaviMail = useCallback(async () => {
        if (await Linking.canOpenURL('mailto:suporte@douglasndm.dev'))
            await Linking.openURL('mailto:suporte@douglasndm.dev');
    }, []);

    const handleFlatIconPress = useCallback(async () => {
        await Linking.openURL('https://www.flaticon.com/authors/srip');
    }, []);

    const handleShareIdInfo = useCallback(async () => {
        const userInfo = {
            purchase_idetinfy: pid,
            firebase_messaging: firebaseId,
            oneSignal: signalId,
        };
        await shareText({
            title: 'User informations',
            text: JSON.stringify(userInfo),
        });
    }, [firebaseId, pid, signalId]);

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
                    {`${
                        strings.View_About_AppVersion
                    } ${getVersion()} (Build: ${getBuildNumber()})`}
                </ApplicationVersion>
                <ApplicationVersion>{`${getSystemName()} ${getSystemVersion()}`}</ApplicationVersion>
            </AboutSection>

            <IdContainer onLongPress={handleShareIdInfo}>
                <View>
                    <UserId>{`fid: ${firebaseId}`}</UserId>
                    <UserId>{`pid: ${pid}`}</UserId>
                    <UserId>{`sid: ${signalId}`}</UserId>
                </View>
            </IdContainer>

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
                <Text>{strings.View_About_LogoMadeBy}</Text>

                <View>
                    <Link onPress={handleFlatIconPress}>
                        https://www.flaticon.com/authors/srip
                    </Link>
                </View>
            </AboutSection>

            <AboutSection>
                <Text>{strings.View_About_DevelopedBy}</Text>
            </AboutSection>

            <SocialContainer>
                <SocialIcon
                    name="desktop-outline"
                    onPress={handleNavigateToSite}
                />
                <SocialIcon
                    name="logo-linkedin"
                    onPress={handleLinkedinPress}
                />
                <SocialIcon name="logo-twitter" onPress={handleNaviTwitter} />
                <SocialIcon name="mail-outline" onPress={handleNaviMail} />
            </SocialContainer>
        </Container>
    );
};

export default About;
