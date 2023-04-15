import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.View`
	margin: 20px 10px 0;
`;

export const ActionsButtonContainer = styled.View`
	flex-direction: row;
	justify-content: center;
	margin-top: 10px;
`;
