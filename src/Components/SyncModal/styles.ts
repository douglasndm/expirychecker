import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { darken } from 'polished';

export const Container = styled.View`
	flex: 1;
	background-color: #000;
`;

export const Header = styled.SafeAreaView`
	height: 10%;

	justify-content: center;
	align-items: center;
`;

export const CloseButtonContainer = styled.TouchableOpacity`
	position: absolute;
	top: 20px;
	right: 10px;
	padding: 10px;
`;

export const CloseButton = styled(Ionicons).attrs(() => ({
	name: 'close-outline',
	size: 32,
}))`
	color: #fff;
`;

export const Content = styled.SafeAreaView`
	flex: 1;
	justify-content: center;
	align-items: center;
	margin: 0 20px;
`;

export const Title = styled.Text`
	font-size: 24px;
	color: #fff;
	font-weight: bold;
	text-align: center;
	margin-top: 10px;
`;

export const Description = styled.Text`
	font-size: 18px;
	margin: 10px 0;
	text-align: center;
	color: #fff;
	flex: 1;
`;

export const ChooseContainer = styled.View`
	margin-top: 25px;
	width: 100%;
	align-items: center;
`;

export const ChooseText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	text-align: center;
	color: #fff;
`;

export const CardContainer = styled.View`
	margin: 15px 0;
	flex-direction: row;
	width: 80%;
	justify-content: space-between;
`;

interface CardProps {
	selected?: boolean;
}

export const Card = styled.TouchableOpacity<CardProps>`
	background-color: ${props => props.theme.colors.accent};
	border-radius: 12px;

	${props =>
		props.selected &&
		`
        background-color: ${darken(0.25, props.theme.colors.accent)};
    `}
`;

export const Icon = styled(Ionicons).attrs(() => ({
	size: 50,
	color: '#fff',
}))`
	padding: 15px;
`;
