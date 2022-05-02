import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import { Button, DataTable } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.View`
    flex-direction: row;
`;

export const ActionButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 5px 10px;
`;

export const ButtonPaper = styled(Button).attrs(props => ({
    color: props.theme.colors.textAccent,
}))``;

export const Table = styled(DataTable)`
    background-color: ${props => props.theme.colors.productBackground};
    border-radius: 12px;
`;

export const TableHeader = styled(DataTable.Header)``;

export const TableTitle = styled(DataTable.Title).attrs(props => ({
    theme: {
        ...props.theme,
        colors: {
            text: props.theme.colors.productCardText,
        },
    },
}))``;

export const Icons = styled(Ionicons).attrs(props => ({
    size: 22,
    color: props.theme.colors.text,
}))``;

export const SelectButtonContainer = styled.View`
    justify-content: center;
`;

export const SelectButton = styled(RectButton)`
    margin-left: 7px;
`;

export const SelectIcon = styled(Ionicons).attrs(props => ({
    size: 28,
    color: props.theme.colors.text,
}))``;
