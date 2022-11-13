import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.SafeAreaView`
    flex: 1;
    background: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.ScrollView``;

export const SuccessMessageContainer = styled.View`
    flex-direction: column;
    align-items: center;
`;

export const Title = styled.Text`
    color: ${props => props.theme.colors.text};
    font-size: 24px;
    font-weight: bold;
    margin: 10px 0 0;
`;

export const Description = styled.Text`
    color: ${props => props.theme.colors.subText};
    font-size: 16px;
    margin-bottom: 15px;
`;

export const ButtonContainer = styled.View`
    flex-direction: column;
`;

export const Button = styled(RectButton)`
    align-items: center;
    align-self: center;
    padding: 22px;
    width: 200px;
    background-color: ${props => props.theme.colors.accent};
    border-radius: 12px;
    margin: 5px 0;
    elevation: 2;
`;

export const ButtonText = styled.Text`
    color: #fff;
    text-align: center;
`;
