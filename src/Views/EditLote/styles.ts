import styled from 'styled-components/native';
import { Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NumericInput from '@wwdrew/react-native-numeric-textinput';

export const Button = styled(ButtonPaper).attrs((props) => ({
    color: props.theme.colors.accent,
}))``;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const NumericInputField = styled(NumericInput).attrs((props) => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;
