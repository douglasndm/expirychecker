import styled, { css } from 'styled-components/native';
import { DataTable } from 'react-native-paper';

interface IProductProps {
    expired?: boolean;
    nextToExp?: boolean;
    treated?: boolean;
}

interface TableRowProps {
    expired?: boolean;
    nextToExp?: boolean;
    treated?: boolean;
}

export const RowContainer = styled.Pressable`
    flex: 1;
`;

export const TableRow = styled(DataTable.Row)<TableRowProps>`
    background: ${({ theme }) => theme.colors.productBackground};

    ${props =>
        props.nextToExp &&
        css`
            background: ${({ theme }) =>
                theme.colors.productNextToExpBackground};
        `};

    ${props =>
        props.expired &&
        css`
            background: ${({ theme }) => theme.colors.productExpiredBackground};
        `};

    ${props =>
        props.treated &&
        css`
            background-color: #47c914;
        `};
`;

export const TableCell = styled(DataTable.Cell)``;

export const Text = styled.Text<IProductProps>`
    color: ${props => props.theme.colors.productCardText};

    ${props =>
        (props.expired || props.nextToExp || props.treated) &&
        css`
            color: white;
        `};
`;
