import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton)`
    margin: 5px 10px;
    background: #cc4b4b;
    border-radius: 12px;
`;

export const Text = styled.Text`
    margin: 10px;
    font-size: 13px;
    text-transform: uppercase;
    text-align: center;
    color: #fff;
    font-weight: bold;
`;

export const EmptyHack = styled.View``;
