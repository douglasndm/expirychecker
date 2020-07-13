import styled from 'styled-components/native';

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
    max-width: 75%;
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
    color: #81d0fd;
    font-size: 16px;
`;

export const ProductLoteContainer = styled.View`
    background-color: #fff;
    margin-bottom: 15px;
    padding: 12px 14px;
    border-radius: 12px;

    flex-direction: column;
`;

export const LoteContainer = styled.View``;
export const LoteTitle = styled.Text`
    font-weight: bold;
    font-size: 22px;
`;

export const Lote = styled.Text`
    font-size: 20px;
`;

export const StatusContainer = styled.View``;

export const StatusTitle = styled.Text`
    font-weight: bold;
    font-size: 22px;
`;
export const Status = styled.Text`
    font-size: 20px;
`;

export const AmountContainer = styled.View`
    align-items: center;
`;
export const AmountTitleText = styled.Text`
    font-weight: bold;
    font-size: 22px;
`;

export const ProductAmount = styled.Text`
    font-size: 20px;
`;

export const ProductExpDate = styled.Text`
    margin-top: 10px;
    font-size: 14px;
`;
