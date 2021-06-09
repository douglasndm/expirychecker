import styled from 'styled-components/native';
import {
    Button as ButtonPaper,
    RadioButton as RadioPaper,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const LoadingText = styled.Text``;

export const PageTitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const ContentHeader = styled.View`
    flex-direction: row;
`;

export const Button = styled(ButtonPaper).attrs(props => ({
    color: props.theme.colors.accent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const RadioButton = styled(RadioPaper).attrs(props => ({
    color: props.theme.colors.accent,
    uncheckedColor: props.theme.colors.subText,
}))``;

export const RadioButtonText = styled.Text`
    color: ${({ theme }) => theme.colors.text};
`;
