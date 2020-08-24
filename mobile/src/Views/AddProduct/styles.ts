import styled from 'styled-components/native';
import { RNCamera } from 'react-native-camera';
import DatePicker from 'react-native-date-picker';

export const Container = styled.View`
    padding: 16px 16px 0 16px;

    flex: 1;
    flex-direction: column;

    background: ${({ theme }) => theme.colors.background};
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const InputContainer = styled.View`
    margin-top: 25px;
`;

export const InputGroup = styled.View`
    flex-direction: row;
    margin: 0 1px;
`;

export const InputText = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const ExpDateGroup = styled.View`
    align-items: center;
`;
export const ExpDateLabel = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.colors.subText};
    margin-top: 10px;
    margin-bottom: 10px;
`;

export const CustomDatePicker = styled(DatePicker)`
    background: ${({ theme }) => theme.colors.productBackground};
    z-index: 1;
`;

export const Camera = styled(RNCamera)`
    align-self: center;

    margin-top: 10px;
    margin-bottom: 10px;

    width: 100%;
    height: 5%;
`;
