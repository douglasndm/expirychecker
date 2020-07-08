import styled from 'styled-components/native';

export const Container = styled.View`
    padding: 16px;
`;

export const PageTitle = styled.Text`
    font-size: 36px;
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
    padding: 12px 16px;
    border-radius: 12px;
`;

export const ProductLote = styled.Text`
    font-size: 20px;
`;

export const ProductAmount = styled.Text`
    font-size: 20px;
`;

export const ProductExpDate = styled.Text`
    font-size: 21px;
`;
