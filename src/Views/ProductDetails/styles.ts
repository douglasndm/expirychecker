import styled, { css } from 'styled-components/native';
import { Button, DataTable, Dialog, FAB } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProduct {
    expired?: boolean;
    nextToExp?: boolean;
    expiredOrNext?: boolean;
}

export const Container = styled.View`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5px 10px 5px;
`;

export const ProductDetailsContainer = styled.View`
    max-width: 60%;
`;

export const PageTitleContent = styled.View`
    flex-direction: row;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;

    color: ${({ theme }) => theme.colors.text};
`;

export const ProductInformationContent = styled.View`
    padding: 0 10px;
`;

export const ProductName = styled.Text`
    font-size: 24px;
    margin-left: 5px;

    color: ${({ theme }) => theme.colors.text};
`;

export const ProductCode = styled.Text`
    font-size: 18px;
    margin-left: 5px;

    margin-bottom: 7px;

    color: ${({ theme }) => theme.colors.text};
`;

export const ProductStore = styled.Text`
    font-size: 18px;
    margin-left: 5px;

    margin-bottom: 7px;

    color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.View`
    padding: 0 16px 16px 16px;
`;

export const ButtonPaper = styled(Button).attrs((props) => ({
    color: props.theme.colors.accent,
}))`
    color: ${({ theme }) => theme.colors.text};
`;

export const Icons = styled(Ionicons)`
    color: ${({ theme }) => theme.colors.text};
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin: 10px 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: ${(props) => props.theme.colors.accent};
    font-size: 18px;
`;

export const TableContainer = styled.View``;

export const Table = styled(DataTable)`
    background-color: ${(props) => props.theme.colors.productBackground};
    border-radius: 12px;
`;

export const TableHeader = styled(DataTable.Header)``;

export const TableTitle = styled(DataTable.Title)`
    color: rgba(255, 255, 255, 1);
`;

export const TableRow = styled(DataTable.Row)<IProduct>`
    background: ${({ theme }) => theme.colors.productBackground};

    ${(props) =>
        props.nextToExp &&
        css`
            background: ${({ theme }) =>
                theme.colors.productNextToExpBackground};
        `}

    ${(props) =>
        props.expired &&
        css`
            background: ${({ theme }) => theme.colors.productExpiredBackground};
        `}
`;

export const TableCell = styled(DataTable.Cell)``;

export const Text = styled.Text<IProduct>`
    color: ${(props) => props.theme.colors.text};

    ${(props) =>
        props.expiredOrNext &&
        css`
            color: white;
        `}
`;

export const DialogPaper = styled(Dialog)`
    background: ${(props) => props.theme.colors.productBackground};
`;

export const FloatButton = styled(FAB).attrs((props) => ({
    color: 'white',
}))`
    background-color: ${({ theme }) => theme.colors.accent};

    position: absolute;
    bottom: 20px;
    right: 20px;
`;
