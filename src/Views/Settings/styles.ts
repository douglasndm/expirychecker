import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Request {
    notPremium?: boolean;
}

export const Container = styled.View`
    flex: 1;
    background: ${(props) => props.theme.colors.background};
`;
export const PageHeader = styled.View`
    flex-direction: row;
    align-items: center;
`;

export const BackButton = styled(RectButton)``;

export const BackButtonImage = styled(Ionicons).attrs((props) => ({
    name: 'arrow-back-outline',
    color: props.theme.colors.text,
    size: 28,
}))``;

export const PageTitle = styled.Text`
    margin-left: 10px;
    font-size: 28px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

export const Category = styled.View`
    margin-top: 20px;
    padding: 15px;

    background-color: ${(props) => props.theme.colors.productBackground};
    border-radius: 12px;
`;

export const CategoryTitle = styled.Text`
    font-size: 21px;
    color: ${(props) => props.theme.colors.text};
`;

export const CategoryOptions = styled.View<Request>`
    margin-top: 20px;

    opacity: ${(props) => (props.notPremium ? 0.2 : 1)};
`;
export const SettingDescription = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
`;

export const InputSetting = styled.TextInput`
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin-top: 8px;
    padding: 10px;

    color: ${(props) => props.theme.colors.text};
    border-color: ${(props) => props.theme.colors.text};
`;

export const PremiumButtonsContainer = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: 10px;
`;

export const ButtonPremium = styled.TouchableOpacity`
    margin-left: 10px;
    margin-right: 10px;
    background-color: ${(props) => props.theme.colors.accent};
    padding: 20px;
    border-radius: 12px;
`;

export const ButtonPremiumText = styled.Text`
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
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

    color: ${(props) => props.theme.colors.text};
`;
