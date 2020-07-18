import styled from 'styled-components/native';
import TextInputMask from '@react-native-community/masked-view';

export const Container = styled.View`
    padding: 16px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
`;

export const Category = styled.View`
    margin-top: 20px;
    padding: 15px;

    background-color: #fff;
    border-radius: 12px;
`;

export const CategoryTitle = styled.Text`
    font-size: 21px;
`;

export const CategoryOptions = styled.View`
    margin-top: 20px;
`;
export const SettingDescription = styled.Text`
    font-size: 14px;
`;

export const InputSetting = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin-top: 8px;
    padding: 10px;
`;
