import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';

export const Container = styled.View`
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

export const ButtonPaper = styled(Button).attrs(props => ({
    color: props.theme.colors.textAccent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;
