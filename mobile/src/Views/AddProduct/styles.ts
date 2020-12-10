import styled from 'styled-components/native';
import { RNCamera } from 'react-native-camera';
import DatePicker from 'react-native-date-picker';
import NumericInput from '@wwdrew/react-native-numeric-textinput';

export const Container = styled.View`
    flex: 1;
    flex-direction: column;

    background: ${({ theme }) => theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    margin-top: 15px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.View`
    padding: 0 16px 16px 16px;
`;

export const InputContainer = styled.View`
    margin-top: 25px;
`;

export const NumericInputField = styled(NumericInput).attrs((props) => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const InputGroup = styled.View`
    flex-direction: row;
    margin: 0 1px;
`;

export const InputText = styled.TextInput.attrs((props) => ({
    placeholderTextColor: props.theme.colors.subText,
}))`
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 12px;
    padding: 15px;
    font-size: 18px;
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.inputText};
`;

export const MoreInformationsContainer = styled.View``;

export const MoreInformationsTitle = styled.Text`
    font-size: 16px;
    text-align: right;
    color: ${({ theme }) => theme.colors.subText};
    margin-bottom: 5px;
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

export const CustomDatePicker = styled(DatePicker).attrs((props) => ({
    textColor: props.theme.colors.inputText,
}))`
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