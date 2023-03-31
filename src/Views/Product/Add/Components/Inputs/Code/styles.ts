import styled from 'styled-components/native';
import { css } from 'styled-components';

interface InputTextContainerProps {
	hasError?: boolean;
}

export const InputTextIconContainer = styled.TouchableOpacity``;

export const InputTextLoading = styled.ActivityIndicator.attrs(props => ({
	size: 26,
	color: props.theme.colors.text,
}))`
	margin-right: 7px;
	margin-left: 7px;
`;

export const InputCodeTextContainer = styled.View<InputTextContainerProps>`
	flex-direction: row;
	justify-content: center;
	align-items: center;
	border: 1px solid rgba(0, 0, 0, 0.1);
	margin-bottom: 10px;
	border-radius: 12px;
	background-color: ${({ theme }) => theme.colors.inputBackground};
	padding-right: 10px;

	${props =>
		props.hasError &&
		css`
			border: 2px solid red;
		`}
`;

export const InputCodeText = styled.TextInput.attrs(props => ({
	placeholderTextColor: props.theme.colors.placeholderColor,
}))`
	flex: 1;
	padding: 15px 5px 15px 15px;
	font-size: 18px;
	color: ${({ theme }) => theme.colors.inputText};
`;
