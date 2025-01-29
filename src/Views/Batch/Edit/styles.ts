import styled from 'styled-components/native';
import { RadioButton as RadioPaper } from 'react-native-paper';

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
