import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.TouchableOpacity`
	background-color: #012866;
	margin: 10px;
	border-radius: 12px;
	padding: 15px;
	flex-direction: row;
	align-items: center;
`;

export const Icon = styled(Ionicons).attrs(() => ({
	color: '#ffffff',
	size: 28,
}))`
	margin-right: 8px;
`;

export const TextContainer = styled.View``;

export const Text = styled.Text`
	color: #fff;
	font-family: 'Open Sans';
	font-weight: bold;
`;
