import styled from 'styled-components/native';

export const Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.View`
	margin: 0 10px;
`;
