import styled from 'styled-components/native';

export const Container = styled.View``;

export const Card = styled.TouchableOpacity`
    background-color: white;
    margin: 3px 6px;
    border-radius: 12px;

    padding: 15px;

    elevation: 2;
`;

export const ProductDetails = styled.View`
    flex-direction: row;
    justify-content: space-between;
`;

export const ProductDetailsContainer = styled.View`
    max-width: 71%;
`;

export const ProductName = styled.Text`
    font-size: 22px;
    font-weight: bold;

    color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;

export const ProductCode = styled.Text`
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    margin-left: 2px;

    color: ${(props) =>
        props.textColor ? props.textColor : 'rgba(0, 0, 0, 0.3)'};
`;

export const InputText = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    background-color: #fff;
    font-size: 18px;
`;

export const ProductLote = styled.Text`
    font-size: 12px;
    margin-left: 2px;

    color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;

export const ProductExpDate = styled.Text`
    font-size: 16px;
    margin-left: 2px;
    margin-top: 5px;

    color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;

export const AmountContainer = styled.View`
    justify-content: center;
    align-items: center;
    margin-right: 10px;
`;

export const AmountContainerText = styled.Text`
    font-size: 16px;

    color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;

export const Amount = styled.Text`
    font-size: 22px;
    font-weight: bold;
    margin-top: 5px;

    color: ${(props) => (props.textColor ? props.textColor : 'black')};
`;
