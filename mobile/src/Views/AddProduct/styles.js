import styled from 'styled-components/native';
import { RNCamera } from 'react-native-camera';
import DatePicker from 'react-native-date-picker';

export const Container = styled.View`
    padding: 16px;

    flex: 1;
    flex-direction: column;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
`;

export const InputContainer = styled.View`
    margin-top: 25px;
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

export const Camera = styled(RNCamera)`
    align-self: center;
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
