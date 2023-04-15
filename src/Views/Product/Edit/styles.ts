import styled, { css } from 'styled-components/native';
import { Dialog } from 'react-native-paper';

interface IProductStatus {
	expired?: boolean;
	nextToExp?: boolean;
	expiredOrNext?: boolean;
}

export const ActionsButtonContainer = styled.View`
	flex-direction: row;
	justify-content: center;
`;

export const Text = styled.Text<IProductStatus>`
	color: ${props => props.theme.colors.text};

	${props =>
		props.expiredOrNext &&
		css`
			color: white;
		`}
`;

export const DialogPaper = styled(Dialog)`
	background: ${props => props.theme.colors.productBackground};
`;
