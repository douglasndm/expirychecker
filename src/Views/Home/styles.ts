import styled, { css } from 'styled-components/native';
import { Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
	flex: 1;
	background: ${props => props.theme.colors.background};
`;

export const InputTextContainer = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border: 1px solid rgba(0, 0, 0, 0.1);
	margin: 10px 10px 5px 10px;
	border-radius: 12px;
	background-color: ${({ theme }) => theme.colors.inputBackground};
	padding-right: 10px;
`;

export const ActionButtonsContainer = styled.View`
	flex-direction: row;
`;

export const InputTextIconContainer = styled(RectButton)``;

interface InputTextIconProps {
	name: string;
}

export const InputTextIcon = styled(Ionicons).attrs(props => ({
	name: props.name,
	size: Dimensions.get('window').height <= 600 ? 28 : 33,
	color: props.theme.colors.productCardText,
}))<InputTextIconProps>``;

export const InputSearch = styled.TextInput.attrs(props => ({
	placeholderTextColor: props.theme.colors.placeholderColor,
}))`
	flex: 1;
	padding: 15px 5px 15px 15px;
	font-size: 18px;
	color: ${props => props.theme.colors.inputText};

	${Dimensions.get('window').height <= 600 &&
	css`
		padding: 10px;
	`}
`;
