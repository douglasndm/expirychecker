import styled from 'styled-components/native';

export const Container = styled.View``;

export const Card = styled.TouchableOpacity`
    background-color: ${(props) => (props.vencido ? '#CC4B4B' : '#fff')};
    margin: 3px 6px;
    border-radius: 12px;

    padding: 15px;

    elevation: 2;
`;

export const ProductDetails = styled.View`
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

    background-color: ${(props) => (props.vencido ? '#EE2222' : 'white')};
    color: ${(props) => (props.vencido ? 'white' : 'black')};
    border-radius: 12px;
    padding-left: ${(props) => (props.vencido ? '10px' : '0')};
    padding-right: ${(props) => (props.vencido ? '10px' : '0')};
`;

export const AmountContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

export const AmountContainerText = styled.Text`
    font-size: 16px;
`;

export const Amount = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-top: 5px;
`;
