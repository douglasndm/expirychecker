import styled from 'styled-components/native';
import { RadioButton as Radio } from 'react-native-paper';

export const Container = styled.View`
	flex: 1;
	background-color: ${props => props.theme.colors.background};
`;

export const Content = styled.ScrollView``;

export const CategoryTitle = styled.Text`
	font-size: 22px;
	font-weight: bold;
	margin-bottom: 15px;
	color: ${props => props.theme.colors.productCardText};
`;

export const ExportOptionContainer = styled.View`
	margin: 10px;
	padding: 20px;
	border-radius: 12px;
	background-color: ${props => props.theme.colors.productBackground};
`;

export const ExportExplain = styled.Text`
	font-size: 16px;
	color: ${props => props.theme.colors.productCardText};
`;

export const SortTitle = styled.Text`
	font-size: 15px;
	font-weight: bold;
	margin: 20px 0 0 0;

	color: ${props => props.theme.colors.text};
`;

export const LinkEmptyExcel = styled.Text`
	color: ${props => props.theme.colors.textAccent};
	font-family: 'Open Sans';
	text-align: center;
`;

export const Loading = styled.ActivityIndicator.attrs(props => ({
	size: 48,
	color: props.theme.colors.accent,
}))``;

export const RadioButtonGroupContainer = styled.View`
	justify-content: center;
	align-items: center;
`;

export const RadioButtonContainer = styled.View`
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

export const RadioButtonText = styled.Text`
	color: ${props => props.theme.colors.productCardText};
`;

export const RadioButton = styled(Radio).attrs(({ theme }) => ({
	color: theme.colors.accent,
}))``;
