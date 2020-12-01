import styled, { css } from 'styled-components/native';
import { DataTable } from 'react-native-paper';

interface IProduct {
    expired?: boolean;
    nextToExp?: boolean;
    expiredOrNext?: boolean;
}

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
