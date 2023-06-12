import styled, { css } from 'styled-components/native';

export const Container = styled.SafeAreaView`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const BatchContainer = styled.View`
	margin: 10px;
`;

export const BatchTitle = styled.Text`
	font-weight: bold;
	font-size: 22px;
	font-family: 'Open Sans';
	color: ${props => props.theme.colors.text};
`;

export const BatchExpDate = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const BatchAmount = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const BatchPrice = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const Text = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	color: ${props => props.theme.colors.text};
`;

export const BannerContainer = styled.View`
	align-items: center;
	margin-top: 25px;
`;

interface ProFeaturesContainerProps {
	disabled?: boolean;
}

export const ProFeaturesText = styled.Text`
	font-family: 'Open Sans';
	font-size: 16px;
	text-align: center;
	margin-top: 20px;
	font-weight: bold;
	text-transform: uppercase;

	color: ${props => props.theme.colors.text};
`;

export const ProFeaturesContainer = styled.View<ProFeaturesContainerProps>`
	${props =>
		props.disabled &&
		css`
			opacity: 0.5;
		`}
`;
