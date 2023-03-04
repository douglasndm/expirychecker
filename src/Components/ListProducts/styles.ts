import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
	flex: 1;
	padding-bottom: 15px;
`;

export const ActionButtonsContainer = styled.View`
	flex-direction: column;
	align-items: flex-end;
	margin: 5px 10px;
`;

export const ButtonPaper = styled(Button).attrs(props => ({
	color: props.theme.colors.textAccent,
	uppercase: true,
	labelStyle: {
		fontSize: 18,
	},
}))``;

export const EmptyListText = styled.Text`
	margin-top: 10px;
	margin-left: 15px;
	margin-right: 15px;
	color: ${({ theme }) => theme.colors.text};
`;

export const InvisibleComponent = styled.View`
	margin-bottom: 100px;
`;

export const ProductContainer = styled.Pressable`
	flex-direction: row;
`;

export const SelectButtonContainer = styled.View`
	justify-content: center;
`;

export const SelectButton = styled(RectButton)`
	margin-left: 7px;
`;

export const SelectIcon = styled(Ionicons).attrs(props => ({
	size: 28,
	color: props.theme.colors.text,
}))``;
