import styled from 'styled-components/native';

export const Container = styled.View`
    margin-bottom: 10px;
`;

export const Card = styled.View`
    background-color: #fff;
    margin: 10px;
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

export const ButtonDetails = styled.TouchableOpacity`
    align-items: flex-end;
    margin-right: 25px;
`;

export const ButtonDetailsText = styled.Text`
    font-size: 14px;
    color: #81d0fd;
`;
