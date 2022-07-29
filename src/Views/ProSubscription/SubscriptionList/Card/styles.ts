import styled, { css } from 'styled-components/native';
import { darken } from 'polished';

interface Offer {
    isSelected?: boolean;
}

export const FirstLine = styled.View`
    flex-direction: row;
    justify-content: center;
`;

export const SubscriptionCostByMonth = styled.Text<Offer>`
    text-align: center;
    font-weight: bold;
    font-size: 22px;
    text-transform: uppercase;

    color: ${({ theme }) => theme.colors.subText};

    ${props =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `};
`;

export const DiscountLabelContainer = styled.View`
    margin-left: 10px;
    background-color: #e60000;
    width: 50px;
    justify-content: center;
    border-radius: 5px;
`;

export const DiscountLabel = styled.Text`
    text-align: center;
    font-weight: bold;
    color: white;
`;

export const DetailsContainer = styled.View<Offer>`
    flex: 1;
    justify-content: center;
    padding: 12px;

    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;

    background-color: ${({ theme }) => theme.colors.productBackground};

    ${props =>
        props.isSelected &&
        css`
            background-color: ${({ theme }) =>
                darken(0.13, theme.colors.productBackground)};
        `}
`;

export const SubscriptionDescription = styled.Text.attrs(() => ({
    textBreakStrategy: 'simple',
}))<Offer>`
    color: white;
    text-align: center;
    align-self: center;
    font-size: 16px;
    ${props =>
        props.isSelected &&
        css`
            color: ${({ theme }) => theme.colors.text};
        `};
`;
