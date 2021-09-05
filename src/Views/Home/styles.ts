import styled from 'styled-components/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const AdContainer = styled.View`
    align-items: center;
    margin-top: 5px;
`;

export const InputTextContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 10px 10px 5px 10px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    padding-right: 10px;
`;

export const InputTextIconContainer = styled(RectButton)``;

export const InputTextIcon = styled(Ionicons).attrs(props => ({
    name: 'barcode-outline',
    size: 36,
    color: props.theme.colors.productCardText,
}))``;

export const InputSearch = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.theme.colors.placeholderColor,
}))`
    padding: 15px 5px 15px 15px;
    font-size: 18px;
    color: ${props => props.theme.colors.inputText};
`;
