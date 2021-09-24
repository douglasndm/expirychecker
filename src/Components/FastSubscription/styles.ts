import styled from 'styled-components/native';
import { lighten } from 'polished';

export const Container = styled.View`
    flex-direction: row;
    margin: 5px 10px;
    background-color: ${props =>
        lighten(0.1, props.theme.colors.inputBackground)};
    padding: 5px 10px;
    border-radius: 12px;
`;

export const SubscriptionText = styled.Text`
    flex: 1;
    margin: 5px 10px;
    font-family: 'Open Sans';
    font-size: 16px;
    text-align: center;
`;

export const SubCardContainer = styled.View`
    background-color: ${props => props.theme.colors.accent};
    border-radius: 12px;
    justify-content: center;
    align-items: center;
    flex: 1;
`;

export const SubCardText = styled.Text`
    color: #fff;
    font-family: 'Open Sans';
    margin: 5px;
    font-size: 16px;
    text-align: center;
`;
