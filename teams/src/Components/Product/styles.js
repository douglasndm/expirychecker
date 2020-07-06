import styled from 'styled-components/native';

export const Container = styled.View``;

export const Card = styled.TouchableOpacity`
    background-color: #fff;
    margin: 3px 6px;
    border-radius: 12px;

    padding: 10px;

    flex-direction: row;
    justify-content: space-between;
`;

export const ProductName = styled.Text`
    font-size: 22px;
    font-weight: bold;
`;

export const ProductCode = styled.Text`
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    margin-left: 2px;
`;

export const ProductLote = styled.Text`
    font-size: 12px;
    margin-left: 2px;
`;

export const ProductExpDate = styled.Text`
    font-size: 16px;
    margin-left: 2px;
    margin-top: 5px;
`;

export const AmountContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

export const AmountContainerText = styled.Text`
    font-size: 18px;
`;

export const Amount = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-top: 5px;
`;
