import React, { useCallback } from 'react';
import { Linking } from 'react-native';

import strings from '@expirychecker/Locales';

import PaddingComponent from '@components/PaddingComponent';

import {
	FooterContainer,
	FooterText,
	TermsPrivacyText,
	TermsPrivacyLink,
} from './styles';

const Footer: React.FC = () => {
	const navigateToTerms = useCallback(async () => {
		await Linking.openURL('https://douglasndm.dev/terms');
	}, []);

	const navigateToPrivacy = useCallback(async () => {
		await Linking.openURL('https://douglasndm.dev/privacy');
	}, []);

	return (
		<>
			<FooterContainer>
				<FooterText>
					{strings.View_Subscription_Disclaim_IntroPrice}
				</FooterText>

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
			</FooterContainer>

			<PaddingComponent />
		</>
	);
};

export default Footer;
