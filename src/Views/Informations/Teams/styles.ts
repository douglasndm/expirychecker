import styled from 'styled-components/native';

export const Container = styled.View`
	background-color: ${({ theme }) => theme.colors.background};
	flex: 1;
`;

export const Content = styled.ScrollView`
	margin: 15px 15px 0;
`;

export const Title = styled.Text`
	font-size: 22px;
	font-weight: bold;

	margin-bottom: 10px;
	color: ${({ theme }) => theme.colors.text};
`;

export const Advantage = styled.Text`
	font-size: 20px;
	margin-bottom: 10px;
	color: ${({ theme }) => theme.colors.text};
`;

export const Text = styled.Text`
	font-size: 16px;
	margin-bottom: 7px;
	font-family: 'Open Sans';
	color: ${({ theme }) => theme.colors.text};
`;

export const WarningText = styled.Text`
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 7px;
	font-family: 'Open Sans';
	color: red;
	text-align: center;
`;
