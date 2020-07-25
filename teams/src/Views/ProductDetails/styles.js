import styled from 'styled-components/native';
import { DataTable } from 'react-native-paper';

export const Container = styled.View`
    padding: 16px;
    elevation: 2;
`;

export const PageHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const ProductDetailsContainer = styled.View`
    max-width: 60%;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
`;

export const ProductName = styled.Text`
    font-size: 24px;
    margin-left: 5px;
`;

export const ProductCode = styled.Text`
    font-size: 18px;
    margin-left: 5px;

    margin-bottom: 7px;
`;

export const InputText = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    background-color: #fff;
    font-size: 18px;
`;

export const CategoryDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;

    margin: 10px 5px;
`;

export const CategoryDetailsText = styled.Text`
    color: #14d48f;
    font-size: 18px;
`;

export const Table = styled(DataTable)`
    background-color: #fff;
    border-radius: 12px;
`;

export const TableHeader = styled(DataTable.Header)``;

export const TableTitle = styled(DataTable.Title)``;

export const TableRow = styled(DataTable.Row)``;

export const TableCell = styled(DataTable.Cell)``;
