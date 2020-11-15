import styled from 'styled-components/native';
import { Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const LoadingText = styled.Text``;

export const PageTitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const Button = styled(ButtonPaper).attrs((props) => ({
    color: props.theme.colors.accent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;
