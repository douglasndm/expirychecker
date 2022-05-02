import styled from 'styled-components/native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const HeaderContainer = styled.View``;

export const ActionsButtonContainer = styled.View`
    flex-direction: column;
    align-items: flex-start;
    margin-top: 5px;
`;

export const ButtonPaper = styled(Button).attrs(props => ({
    color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;
