import styled from 'styled-components/native';
import DatePicker from 'react-native-date-picker';

export const Container = styled.View`
    margin: 10px 10px;

    align-items: stretch;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
`;

export const InputContainer = styled.View`
    margin-top: 25px;
`;

export const InputText = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    background-color: #fff;
    font-size: 18px;
`;

export const InputGroup = styled.View`
    flex-direction: row;
    margin: 0 1px;
`;

export const ExpDateGroup = styled.View`
    align-items: center;
`;
export const ExpDateLabel = styled.Text`
    font-size: 16px;
    color: #999;
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const CustomDatePicker = styled(DatePicker)`
    background: white;
`;

export const Button = styled.TouchableOpacity`
    background-color: #14d48f;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100px;
    padding: 15px;
    border-radius: 12px;

    align-self: center;
`;

export const ButtonText = styled.Text`
    color: #fff;
    text-align: center;
`;
