import React, { useCallback, useMemo } from 'react';
import { Platform, Linking, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Analytics from '@react-native-firebase/analytics';

import strings from '@expirychecker/Locales';

import { isSubscriptionActive } from '@expirychecker/Functions/ProMode';

import PaddingComponent from '@components/PaddingComponent';

import {
	Container,
	Content,
	HeaderContainer,
	Icon,
	ExitButtonContainer,
	WarningIconContainer,
	TextContainer,
	ExplainTitle,
	FeaturesTitle,
	FeatureContainer,
	FeatureText,
	KeepSubscriptionButton,
	CancelSubscriptionButton,
	TextButton,
	ButtonsContainer,
} from './styles';

const Cancel: React.FC = () => {
	const { goBack, reset } =
		useNavigation<StackNavigationProp<RoutesParams>>();

	const goHome = useCallback(() => {
		reset({
			routes: [{ name: 'Home' }],
		});
	}, [reset]);

	const cancelSubscriptionLink = useMemo(() => {
		return Platform.OS === 'ios'
			? 'https://apps.apple.com/account/subscriptions'
			: 'https://play.google.com/store/account/subscriptions?sku=controledevalidade_pro_monthly&package=com.controledevalidade';
	}, []);

	const handleCancel = useCallback(async () => {
		if (!__DEV__)
			Analytics().logEvent('User_opened_the_store_link_to_cancel');

		await Linking.openURL(cancelSubscriptionLink);

		if (!(await isSubscriptionActive())) {
			goHome();
		}
	}, [cancelSubscriptionLink, goHome]);

	const userDidNotCancel = useCallback(() => {
		if (!__DEV__)
			Analytics().logEvent('User_kept_subscription_on_cancel_page');

		goHome();
	}, [goHome]);

	return (
		<Container>
			<Content>
				<HeaderContainer>
					<ExitButtonContainer>
						<TouchableOpacity onPress={goBack}>
							<Icon
								name="close-outline"
								size={50}
								color="#ffffff"
							/>
						</TouchableOpacity>
					</ExitButtonContainer>

					<WarningIconContainer>
						<Icon
							name="warning-outline"
							size={120}
							color="#ffffff"
						/>
					</WarningIconContainer>

					<ExplainTitle>
						{strings.View_Subscription_Cancel_ExplainTitle}
					</ExplainTitle>
				</HeaderContainer>

				<TextContainer>
					<FeaturesTitle>
						{strings.View_Subscription_Cancel_FeaturesTitle}
					</FeaturesTitle>

					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature1}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature2}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature3}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature4}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature5}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature6}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature7}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature8}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature9}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature10}
						</FeatureText>
					</FeatureContainer>
					<FeatureContainer>
						<FeatureText>
							🚫 {strings.View_Subscription_Cancel_Feature11}
						</FeatureText>
					</FeatureContainer>
				</TextContainer>

				<ButtonsContainer>
					<KeepSubscriptionButton onPress={userDidNotCancel}>
						<TextButton>
							{
								strings.View_Subscription_Cancel_Button_KeepSubscription
							}
						</TextButton>
					</KeepSubscriptionButton>
					<CancelSubscriptionButton onPress={handleCancel}>
						<TextButton>
							{
								strings.View_Subscription_Cancel_Button_CancelSubscription
							}
						</TextButton>
					</CancelSubscriptionButton>
				</ButtonsContainer>

				<PaddingComponent />
			</Content>
		</Container>
	);
};

export default Cancel;
