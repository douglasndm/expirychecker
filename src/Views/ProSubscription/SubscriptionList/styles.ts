import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View``;

export const SubscriptionsGroup = styled.View`
    flex-direction: column;
    margin: 0 10px 15px;
`;

interface Offer {
    isSelected?: boolean;
}

export const SubscriptionContainer = styled(RectButton)<Offer>`
    flex: 1;
    flex-direction: column;
    border-radius: 12px;

    margin-top: 10px;

    background-color: ${props => props.theme.colors.productBackground};
`;

export const SubscriptionPeriodContainer = styled.View<Offer>`
    background-color: rgba(200, 200, 200, 0.5);
    padding: 15px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;

    ${props =>
        props.isSelected &&
        css`
            background-color: ${({ theme }) => theme.colors.accent};
        `}
`;

export const SubscriptionPeriod = styled.Text<Offer>`
    color: white;
    text-align: center;
    font-size: 18px;
    font-weight: bold;

    color: ${({ theme }) => theme.colors.text};

    ${props =>
        props.isSelected &&
        css`
            color: #fff;
        `};
`;

export const ButtonSubscription = styled.TouchableOpacity`
    background-color: ${props => props.theme.colors.accent};
    margin: 0 10px 10px 10px;
    padding: 15px;
    border-radius: 12px;
`;

export const TextSubscription = styled.Text<Offer>`
    text-align: center;
    font-size: 17px;

    color: ${({ theme }) => theme.colors.text};
`;

export const ButtonText = styled.Text`
    text-align: center;
    color: #ffffff;
    font-size: 17px;
`;

export const LoadingIndicator = styled.ActivityIndicator.attrs(() => ({
    color: '#ffffff',
    size: 36,
}))``;
