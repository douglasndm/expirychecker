import styled from 'styled-components/native';

export const Container = styled.View`
    padding: 16px;
    flex: 1;
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

    opacity: ${(props) => (props.notPremium ? 0.2 : 1)};
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

export const PremiumButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
`;

export const ButtonPremium = styled.TouchableOpacity`
    margin-left: 10px;
    margin-right: 10px;
    background-color: #fff;
    padding: 20px;
    border-radius: 12px;
`;

export const ButtonPremiumText = styled.Text`
    font-size: 14px;
`;

export const ButtonCancel = styled.TouchableOpacity`
    margin-top: 15px;
    background-color: #999;
    padding: 13px;
    border-radius: 12px;

    align-self: center;
`;

export const ButtonCancelText = styled.Text`
    font-size: 13px;
`;
