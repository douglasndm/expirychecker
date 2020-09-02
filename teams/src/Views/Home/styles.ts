import styled from 'styled-components/native';
import { Snackbar } from 'react-native-paper';

export const SnackBar = styled(Snackbar)`
    background: ${({ theme }) => theme.colors.accent};

    border-radius: 12px;
    margin-bottom: 90px;
    padding: 5px;
    opacity: 0.9;
`;
