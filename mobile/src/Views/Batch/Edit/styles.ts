import styled, { css } from 'styled-components/native';
import {
    Button as ButtonPaper,
    RadioButton as RadioPaper,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const PageHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 5px 0 5px;
`;

export const ActionButtonsContainer = styled.View`
    ${isIphoneX() &&
    css`
        margin-top: 30px;
    `}
`;

export const Button = styled(ButtonPaper).attrs(props => ({
    color: props.theme.colors.accent,
}))`
    align-items: flex-start;
`;

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
