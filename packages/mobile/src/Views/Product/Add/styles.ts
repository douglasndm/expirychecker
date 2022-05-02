import styled, { css } from 'styled-components/native';
import DatePicker from 'react-native-date-picker';
import CurrencyInput from 'react-native-currency-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
`;

export const PageContent = styled.ScrollView``;

export const InputContainer = styled.View`
    margin-top: 25px;
    padding: 0 10px;
    margin-bottom: 40px;
`;

export const InputGroup = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 0 0 10px 0;
`;

interface InputTextContainerProps {
    hasError?: boolean;
}

export const InputTextContainer = styled.View<InputTextContainerProps>`
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
    ${props =>
        props.hasError &&
        css`
            border: 2px solid red;
        `}
`;

export const InputTextTip = styled.Text`
    color: red;
    margin: -5px 10px 5px;
`;

export const CameraButtonContainer = styled(RectButton)`
    margin-left: 15px;
`;

export const Icon = styled(Ionicons).attrs(props => ({
    color: props.theme.colors.text,
}))``;

export const ImageContainer = styled.View`
    justify-content: center;
    align-items: center;
`;

export const ProductImageContainer = styled(RectButton)``;

export const ProductImage = styled.Image`
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 75px;

    width: 150px;
    height: 150px;
`;

export const Currency = styled(CurrencyInput).attrs(props => ({
    placeholderTextColor: props.theme.colors.placeholderColor,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const InputCodeTextIcon = styled(Ionicons).attrs(props => ({
    name: 'barcode-outline',
    size: 36,
    color: props.theme.colors.inputText,
}))``;

export const MoreInformationsContainer = styled.View``;

export const MoreInformationsTitle = styled.Text`
    font-size: 16px;
    text-align: right;
    color: ${({ theme }) => theme.colors.subText};
    margin-bottom: 5px;
`;

export const ExpDateGroup = styled.View`
    align-items: center;
`;
export const ExpDateLabel = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colors.subText};
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const CustomDatePicker = styled(DatePicker).attrs(props => ({
    textColor: props.theme.colors.inputText,
    fadeToColor: 'none',
    mode: 'date',
}))`
    background: ${({ theme }) => theme.colors.inputBackground};
    z-index: 1;
`;
