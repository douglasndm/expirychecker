import styled, { css } from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const PageContent = styled.ScrollView`
    margin-top: 15px;
`;

interface WeekProps {
    isPast?: boolean;
    isNext?: boolean;
}

export const WeekContainer = styled(RectButton)<WeekProps>`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 17px 15px;
    margin: 5px 10px;
    border-radius: 12px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${props =>
        props.isNext &&
        css`
            background-color: ${({ theme }) =>
                theme.colors.productNextToExpBackground};
        `}

    ${props =>
        props.isPast &&
        css`
            background-color: ${({ theme }) =>
                theme.colors.productExpiredBackground};
        `}
`;

export const WeekText = styled.Text<WeekProps>`
    color: ${props => props.theme.colors.productCardText};
    font-family: 'Open Sans';
    font-size: 18px;
    font-weight: bold;

    ${props =>
        props.isNext &&
        css`
            color: #fff;
        `}

    ${props =>
        props.isPast &&
        css`
            color: #fff;
        `}
`;

export const ProductCount = styled.Text<WeekProps>`
    color: ${props => props.theme.colors.productCardText};
    font-family: 'Open Sans';
    font-size: 18px;

    ${props =>
        props.isNext &&
        css`
            color: #fff;
        `}

    ${props =>
        props.isPast &&
        css`
            color: #fff;
        `}
`;
