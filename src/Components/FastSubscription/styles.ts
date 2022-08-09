import styled from 'styled-components/native';
import { lighten } from 'polished';

export const FastSubContainer = styled.View`
    flex: 1;
`;

export const Container = styled.View`
    flex-direction: row;
    margin: 5px 10px;
    background-color: ${props =>
        lighten(0.1, props.theme.colors.inputBackground)};
    padding: 5px 10px;
    border-radius: 12px;
`;

export const SubscriptionTextContainer = styled.View`
    flex: 1;
    justify-content: center;
`;

export const SubscriptionText = styled.Text`
    margin: 5px 10px;
    font-family: 'Open Sans';
    font-size: 16px;
    text-align: center;
    color: ${props => props.theme.colors.productCardText};
`;
