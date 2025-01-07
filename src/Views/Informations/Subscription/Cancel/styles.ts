import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled(LinearGradient).attrs(() => ({
	start: { x: 0, y: 0 },
	end: { x: 0, y: 0.8 },

	locations: [0.5, 0.5],
	colors: ['#cc002b', '#ffffff'],
}))`
	flex: 1;
	background-color: #ffffff;
`;

export const Content = styled.ScrollView.attrs(() => ({
	contentInsetAdjustmentBehavior: 'automatic',
}))``;

export const HeaderContainer = styled.View`
	background-color: rgba(204, 0, 43, 1);
`;

export const Icon = styled(Ionicons)``;

export const ExitButtonContainer = styled.View`
	margin: 10px 10px 0;
	justify-content: center;
	align-items: flex-start;
`;

export const WarningIconContainer = styled.View`
	justify-content: center;
	align-items: center;

	margin: 25px 0;
`;

export const TextContainer = styled.View`
	background-color: #ffffff;
	padding: 15px;
`;

export const ExplainTitle = styled.Text`
	color: #ffffff;
	font-weight: bold;
	font-size: 26px;
	text-align: center;
	margin: 10px 10px 25px;
`;

export const FeaturesTitle = styled.Text`
	color: #000000;
	font-weight: bold;
	font-size: 20px;
	text-align: left;
`;

export const FeatureContainer = styled.View`
	background-color: aliceblue;
	margin: 5px 0;
	padding: 15px;
	border-radius: 12px;
`;

export const FeatureText = styled.Text`
	color: #000000;
	font-size: 16px;
	text-align: left;
`;

export const ButtonsContainer = styled.View`
	justify-content: center;
	align-items: center;
`;

export const TextButton = styled.Text`
	color: #000000;
`;

export const KeepSubscriptionButton = styled.TouchableOpacity`
	background-color: #2df8d5;
	padding: 25px 45px;
	border-radius: 12px;
`;

export const CancelSubscriptionButton = styled.TouchableOpacity`
	margin-top: 10px;
	color: #000;
`;
