import styled from 'styled-components/native';
import { ActivityIndicator } from 'react-native';

export const LoadContainer = styled.View`
	position: absolute;
	width: 100%;
	height: 100%;
	justify-content: center;
`;

export const LoadIndicator = styled(ActivityIndicator).attrs(({ theme }) => ({
	size: 'large',
	color: theme.colors.accent,
}))``;
