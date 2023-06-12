import styled from 'styled-components/native';
import {
	Button as ButtonPaper,
	RadioButton as RadioPaper,
} from 'react-native-paper';

export const PageHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 5px 0 5px;
`;

export const ActionsButtonContainer = styled.View`
	flex-direction: row;
	justify-content: center;
`;

export const Button = styled(ButtonPaper).attrs(props => ({
	textColor: props.theme.colors.accent,
	labelStyle: {
		textTransform: 'uppercase',
	},
}))`
	align-items: flex-start;
`;

export const RadioButton = styled(RadioPaper).attrs(props => ({
	color: props.theme.colors.accent,
	uncheckedColor: props.theme.colors.subText,
}))``;

export const RadioButtonText = styled.Text`
	color: ${({ theme }) => theme.colors.inputText};
`;

export const TextField = styled.TextInput.attrs(props => ({
	multiline: true,
	placeholderTextColor: props.theme.colors.placeholderColor,
}))`
	background-color: ${props => props.theme.colors.inputBackground};
	color: ${props => props.theme.colors.inputText};

	padding: 15px 10px;
	margin: 5px;
	border-radius: 12px;
	font-size: 16px;
`;
