import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

export const PageContent = styled.View`
    margin-top: 15px;
`;

export const WeekContainer = styled(RectButton)`
    background-color: ${props => props.theme.colors.inputBackground};
    padding: 17px 15px;
    margin: 5px 10px;
    border-radius: 12px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const WeekText = styled.Text`
    color: ${props => props.theme.colors.productCardText};
    font-family: 'Open Sans';
    font-size: 18px;
    font-weight: bold;
`;

export const ProductCount = styled.Text`
    color: ${props => props.theme.colors.productCardText};
    font-family: 'Open Sans';
    font-size: 18px;
`;
