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
	color: ${({ theme }) => theme.colors.text};
`;
