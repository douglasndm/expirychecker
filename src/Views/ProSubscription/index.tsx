import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import strings from '~/Locales';

import SubscriptionList from './SubscriptionList';

import {
    Container,
    HeaderContainer,
    TitleContainer,
    IntroductionText,
    AppNameTitle,
    PremiumTitle,
    AdvantagesGroup,
    AdvantageContainer,
    AdvantageText,
    ButtonSubscription,
    TextSubscription,
    TermsPrivacyText,
    TermsPrivacyLink,
} from './styles';

const Pro: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<RoutesParams>>();

    const handleNavigateHome = useCallback(() => {
        navigate('Home');
    }, [navigate]);

    const navigateToTerms = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/terms');
    }, []);

    const navigateToPrivacy = useCallback(async () => {
        await Linking.openURL('https://douglasndm.dev/privacy');
    }, []);

    return (
        <Container>
            <HeaderContainer>
                <TitleContainer>
                    <IntroductionText>
                        {strings.View_ProPage_MeetPRO}
                    </IntroductionText>
                    <AppNameTitle>{strings.AppName}</AppNameTitle>
                    <PremiumTitle>{strings.View_ProPage_ProLabel}</PremiumTitle>
                </TitleContainer>
            </HeaderContainer>

            <AdvantagesGroup>
                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageOne}
                    </AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageSeven}
                    </AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageTwo}
                    </AdvantageText>
                </AdvantageContainer>

                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageThree}
                    </AdvantageText>
                </AdvantageContainer>
                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageFour}
                    </AdvantageText>
                </AdvantageContainer>
                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageSix}
                    </AdvantageText>
                </AdvantageContainer>
                <AdvantageContainer>
                    <AdvantageText>
                        {strings.View_ProPage_AdvantageFive}
                    </AdvantageText>
                </AdvantageContainer>
            </AdvantagesGroup>

            <SubscriptionList />

            <TermsPrivacyText>
                {strings.View_ProPage_Text_BeforeTermsAndPrivacy}
                <TermsPrivacyLink onPress={navigateToTerms}>
                    {strings.Terms}
                </TermsPrivacyLink>
                {strings.BetweenTermsAndPrivacy}
                <TermsPrivacyLink onPress={navigateToPrivacy}>
                    {strings.PrivacyPolicy}
                </TermsPrivacyLink>
                .
            </TermsPrivacyText>

            <ButtonSubscription onPress={handleNavigateHome}>
                <TextSubscription>
                    {strings.View_ProPage_Button_GoBackToHome}
                </TextSubscription>
            </ButtonSubscription>
        </Container>
    );
};

export default Pro;
