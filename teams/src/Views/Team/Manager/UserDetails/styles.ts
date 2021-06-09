import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Button as ButtonPaper } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const PageHeader = styled.View`
    flex-direction: row;
    margin-top: ${Platform.OS === 'ios' ? 0 : 15}px;
`;

export const PageTitle = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
`;

export const PageContent = styled.View`
    padding: 15px 20px 0;
    flex: 1;
`;

export const UserName = styled.Text`
    font-size: 23px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Open Sans';
`;

export const UserInfo = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Open Sans';
`;

export const CodeDetails = styled.View`
    margin-top: 15px;
    align-self: center;
    align-items: center;
`;

export const CodeTitle = styled.Text`
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Open Sans';
    font-size: 16px;
`;

export const CodeContainer = styled(RectButton)`
    margin-top: 10px;
    background-color: ${props => props.theme.colors.accent};
    padding: 18px 25px;
    border-radius: 8px;

    justify-content: center;
    align-items: center;
`;

export const Code = styled.Text`
    color: #fff;
    font-size: 16px;
    font-weight: bold;
`;

export const ActionsButtonsContainer = styled.View`
    margin-top: 10px;
    flex-direction: row;
`;

export const ActionButton = styled(ButtonPaper).attrs(props => ({
    color: props.theme.colors.accent,
}))``;

export const Icon = styled(Ionicons).attrs(props => ({
    size: 22,
    color: props.theme.colors.text,
}))``;
