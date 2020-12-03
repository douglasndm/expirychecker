import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ButtonPaper = styled(Button).attrs((props) => ({
    color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const SaveCancelButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
`;
