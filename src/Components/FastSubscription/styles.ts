import styled from 'styled-components/native';
import { lighten } from 'polished';

export const FastSubContainer = styled.View``;

export const Container = styled.View`
    flex-direction: row;
    margin: 5px 10px;
    background-color: ${props =>
        lighten(0.1, props.theme.colors.inputBackground)};
    padding: 2px 7px;
    border-radius: 12px;
`;

export const SubscriptionTextContainer = styled.View`
    flex: 1;
    justify-content: center;
`;

export const SubscriptionText = styled.Text`
    font-family: 'Open Sans';
    font-weight: bold;
    font-size: 15px;
    text-align: center;
    color: ${props => props.theme.colors.productCardText};
`;
