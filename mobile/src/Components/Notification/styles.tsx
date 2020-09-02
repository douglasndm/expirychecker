import styled, { css } from 'styled-components/native';
import { Snackbar } from 'react-native-paper';

interface SnackBarProps {
    NotificationType?: 'normal' | 'error';
}

export const SnackBar = styled(Snackbar)<SnackBarProps>`
    background: ${({ theme }) => theme.colors.accent};

    border-radius: 12px;
    margin-bottom: 90px;
    padding: 5px;
    opacity: 0.9;

    ${(props) =>
        props.NotificationType === 'error' &&
        css`
            background: #c41826;
        `}
`;
