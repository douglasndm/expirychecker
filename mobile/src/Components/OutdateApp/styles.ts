import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
    background-color: #b80c00;
    justify-content: center;
    align-items: center;
    padding: 15px;
    margin: 5px;
    border-radius: 12px;
`;

export const Text = styled.Text`
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    font-family: 'Open Sans';
`;
